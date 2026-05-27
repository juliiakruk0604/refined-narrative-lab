import type { ReactNode } from "react";

import { bodyCopy, sectionHeadline, sectionHeaderGrid } from "@/components/framer-section";

type TrustStatsDiagramProps = {
  topValue: ReactNode;
  topCopy: ReactNode;
  bottomValue: ReactNode;
  bottomCopy: ReactNode;
};

export function TrustStatsDiagram({
  topValue,
  topCopy,
  bottomValue,
  bottomCopy,
}: TrustStatsDiagramProps) {
  return (
    <div className={`${sectionHeaderGrid} w-full`}>
      <div className="hidden md:block" aria-hidden="true" />

      <div className="flex flex-col gap-2 text-left">
        <p className={`${sectionHeadline} text-white tabular-nums`}>{topValue}</p>
        <p className={`max-w-[22ch] text-balance ${bodyCopy}`}>{topCopy}</p>
      </div>

      <div className="flex flex-col gap-2 text-left">
        <p className={`${sectionHeadline} text-white tabular-nums`}>{bottomValue}</p>
        <p className={`max-w-[22ch] text-balance ${bodyCopy}`}>{bottomCopy}</p>
      </div>
    </div>
  );
}
