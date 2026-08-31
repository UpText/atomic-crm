import { fetchWithTimeout } from "../../misc/fetchWithTimeout";
import { DOMAINS_NOT_SUPPORTING_FAVICON } from "../../misc/unsupportedDomains.const";
import type { Contact } from "../../types";

export async function hash(string: string) {
  const utf8 = new TextEncoder().encode(string);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    return sha256Fallback(string);
  }

  const hashBuffer = await subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

function sha256Fallback(message: string): string {
  const bytes = new TextEncoder().encode(message);
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >> 6) + 1) << 6;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 4, bitLength);

  const hashValues = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f,
    0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const roundConstants = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const words = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      words[i] = view.getUint32(offset + i * 4);
    }
    for (let i = 16; i < 64; i++) {
      const s0 =
        rotateRight(words[i - 15], 7) ^
        rotateRight(words[i - 15], 18) ^
        (words[i - 15] >>> 3);
      const s1 =
        rotateRight(words[i - 2], 17) ^
        rotateRight(words[i - 2], 19) ^
        (words[i - 2] >>> 10);
      words[i] = words[i - 16] + s0 + words[i - 7] + s1;
    }

    let [a, b, c, d, e, f, g, h] = hashValues;
    for (let i = 0; i < 64; i++) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = h + s1 + choice + roundConstants[i] + words[i];
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = s0 + majority;

      h = g;
      g = f;
      f = e;
      e = d + temp1;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2;
    }

    hashValues[0] += a;
    hashValues[1] += b;
    hashValues[2] += c;
    hashValues[3] += d;
    hashValues[4] += e;
    hashValues[5] += f;
    hashValues[6] += g;
    hashValues[7] += h;
  }

  return hashValues
    .map((value) => (value >>> 0).toString(16).padStart(8, "0"))
    .join("");
}

const rotateRight = (value: number, shift: number) =>
  (value >>> shift) | (value << (32 - shift));

// Helper function to get the Gravatar URL
async function getGravatarUrl(email: string): Promise<string> {
  const hashEmail = await hash(email);
  return `https://www.gravatar.com/avatar/${hashEmail}?d=404`;
}

// Helper function to get the favicon URL
async function getFaviconUrl(domain: string): Promise<string | null> {
  if (DOMAINS_NOT_SUPPORTING_FAVICON.includes(domain)) {
    return null;
  }

  try {
    const faviconUrl = `https://${domain}/favicon.ico`;
    const response = await fetchWithTimeout(faviconUrl);
    if (response.ok) {
      return faviconUrl;
    }
  } catch {
    return null;
  }
  return null;
}

// Main function to get the avatar URL
export async function getContactAvatar(
  record: Partial<Contact>,
): Promise<string | null> {
  if (!record.email_jsonb || !record.email_jsonb.length) {
    return null;
  }

  for (const { email } of record.email_jsonb) {
    if (!email?.includes("@")) {
      continue;
    }

    // Step 1: Try to get Gravatar image
    const gravatarUrl = await getGravatarUrl(email);

    try {
      const gravatarResponse = await fetch(gravatarUrl);
      if (gravatarResponse.ok) {
        return gravatarUrl;
      }
    } catch {
      // Gravatar not found
    }

    // Step 2: Try to get favicon from email domain
    const domain = email.split("@")[1];
    if (!domain) {
      continue;
    }

    const faviconUrl = await getFaviconUrl(domain);
    if (faviconUrl) {
      return faviconUrl;
    }

    // TODO: Step 3: Try to get image from LinkedIn.
  }

  return null;
}
