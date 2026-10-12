import type { RAFile } from "../types";

const importedFiles = new WeakSet<File>();

/** Migration files must retain their original bytes during upload. */
export const isImportedFile = (file?: File) =>
  file != null && importedFiles.has(file);

/** Embedded files become uploads, without retaining source storage paths. */
export const createImportedFile = async (
  src: string,
  title: string,
): Promise<RAFile> => {
  if (!src.startsWith("data:")) return { src, title } as RAFile;
  const response = await fetch(src);
  const blob = await response.blob();
  const rawFile = new File([blob], title, { type: blob.type });
  importedFiles.add(rawFile);
  return {
    src,
    title,
    type: blob.type,
    rawFile,
  };
};
