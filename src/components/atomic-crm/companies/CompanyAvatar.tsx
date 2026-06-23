import { useState } from "react";
import { useRecordContext } from "ra-core";

import type { Company } from "../types";

export const CompanyAvatar = (props: {
  record?: Company;
  width?: 20 | 32 | 40;
  height?: 20 | 32 | 40;
}) => {
  const { width = 40, height = width } = props;
  const record = useRecordContext<Company>(props);
  if (!record) return null;

  const isDefaultSize = width === 40 && height === 40;
  const isCompact = width === 20 || height === 20;
  const sizeClass = isDefaultSize
    ? "w-24 h-12"
    : width === 32 || height === 32
      ? "w-8 h-8"
      : "w-[20px] h-[20px]";
  const [imageFailed, setImageFailed] = useState(false);
  const hasLogo = !!record.logo?.src && !imageFailed;

  return (
    <div
      className={`${sizeClass} flex items-center justify-center overflow-hidden rounded-md bg-background p-1.5`}
    >
      {hasLogo ? (
        <img
          src={record.logo?.src}
          alt={record.name}
          className="h-full w-full object-contain object-center"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-md bg-muted ${
            isCompact ? "text-xs" : "text-sm"
          }`}
        >
          {record.name.charAt(0)}
        </div>
      )}
    </div>
  );
};
