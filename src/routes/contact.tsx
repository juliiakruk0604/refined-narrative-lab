import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Let's talk | R—M" },
      {
        name: "description",
        content:
          "Short message, sharp answer. We reply within one business day across CET / GST timezones.",
      },
      { property: "og:title", content: "Contact — R—M" },
      {
        property: "og:description",
        content: "Short message, sharp answer. We reply within one business day.",
      },
    ],
  }),
  component: ContactPage,
});

const contactLinks = [
  {
    label: "Email",
    href: "mailto:info@realmedia.ink",
    text: "info@realmedia.ink",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/real-media-corp/",
    text: "https://www.linkedin.com/company/real-media-corp/",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.linkedin.com/company/real-media-corp/",
    text: "https://www.linkedin.com/company/real-media-corp/",
    external: true,
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/realmedia26",
    text: "https://dribbble.com/realmedia26",
    external: true,
  },
];

function ContactPage() {
  useReveal();

  return (
    <div className="rm-page selection:bg-rm-accent selection:text-black">
      <SiteHeader variant="dark" />

      <section className="relative px-6 md:px-12 max-w-[1440px] mx-auto pt-24 md:pt-24 pb-24 md:pb-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(50% 60% at 20% 30%, rgba(232,93,58,0.16), transparent 70%), radial-gradient(45% 55% at 85% 75%, rgba(124,92,255,0.16), transparent 70%)",
          }}
        />

        <div className="max-w-[720px]">
          <p className="reveal text-[11px] uppercase tracking-[0.25em] text-white/50 mb-8">
            The conversation starts here
          </p>
          <h1 className="reveal text-[44px] sm:text-[72px] md:text-[104px] leading-[0.92] tracking-[-0.04em] font-medium text-white max-w-[12ch]">
            Let's <span className="font-light text-white/70">talk.</span>
          </h1>
          <p
            className="reveal mt-8 max-w-[44ch] text-[15px] md:text-[17px] leading-relaxed rm-body"
            data-delay="2"
          >
            Short message, sharp answer. We reply within one business day.
          </p>

          <dl className="reveal mt-12 grid grid-cols-1 gap-7" data-delay="3">
            {contactLinks.map((item) => (
              <div key={item.label}>
                <dt className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-2">
                  {item.label}
                </dt>
                <dd>
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-[16px] md:text-[18px] text-white hover:text-rm-accent transition-colors break-all"
                  >
                    {item.text}
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-2">
                Located
              </dt>
              <dd className="text-[18px] md:text-[20px] text-white/85">
                Warsaw · EU · MENA
                <span className="block mt-1 text-[13px] text-white/45">
                  Operating across CET / GST
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
