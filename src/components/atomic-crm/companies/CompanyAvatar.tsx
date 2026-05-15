import { useState } from "react";
import { useRecordContext } from "ra-core";

import type { Company } from "../types";

export const CompanyAvatar = (props: {
  record?: Company;
  width?: 20 | 40;
  height?: 20 | 40;
}) => {
  const { width = 40, height = width } = props;
  const record = useRecordContext<Company>(props);
  if (!record) return null;

  const isSmall = width !== 40 || height !== 40;
  const sizeClass = isSmall ? "w-[20px] h-[20px]" : "w-24 h-12";
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
            isSmall ? "text-xs" : "text-sm"
          }`}
        >
        {record.name.charAt(0)}
        </div>
      )}
    </div>
  );
};
