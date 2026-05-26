import type { ReactNode } from "react";

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
    <div className="rm-trust-stats__stats">
      <div className="rm-trust-stats__stat">
        <p className="rm-trust-stats__stat-value">{topValue}</p>
        <p className="rm-trust-stats__stat-copy">{topCopy}</p>
      </div>
      <div className="rm-trust-stats__stat">
        <p className="rm-trust-stats__stat-value">{bottomValue}</p>
        <p className="rm-trust-stats__stat-copy">{bottomCopy}</p>
      </div>
    </div>
  );
}
