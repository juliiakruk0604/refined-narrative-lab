import { CasesGallerySection } from "@/components/cases-gallery-section";
import { cases as staticCases } from "@/lib/cases";
import { casesGalleryHeaderProps } from "@/lib/cases-gallery-config";
import { getPageDefaults } from "@/lib/page-content/defaults";

export function CasesSection() {
  const work = getPageDefaults("cases").sections?.work;

  return (
    <CasesGallerySection
      {...casesGalleryHeaderProps(work)}
      cases={staticCases.slice(0, 3)}
      viewAllHref="/cases"
    />
  );
}
