import { createFileRoute } from "@tanstack/react-router";

import { ServicePageView } from "@/components/service-page";
import { smmService } from "@/lib/services/content/smm";
import { serviceCardIntro } from "@/lib/services";

export const Route = createFileRoute("/services/smm")({
  head: () => ({
    meta: [
      { title: "SMM — Be seen | R—M" },
      {
        name: "description",
        content: serviceCardIntro(smmService),
      },
      { property: "og:title", content: "SMM — Be seen | R—M" },
      { property: "og:description", content: serviceCardIntro(smmService) },
    ],
  }),
  component: SmmServicePage,
});

function SmmServicePage() {
  return <ServicePageView service={smmService} />;
}
