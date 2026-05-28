import team01 from "@/assets/team-01.jpg";
import team02 from "@/assets/team-02.jpg";
import team03 from "@/assets/team-03.jpg";
import team04 from "@/assets/team-04.jpg";
import team05 from "@/assets/team-05.jpg";
import team06 from "@/assets/team-06.jpg";
import team07 from "@/assets/team-07.jpg";
import {
  DRAGABLE_CAROUSEL_DEFAULTS,
  DragableCarousel,
} from "@/components/dragable-carousel";
import {
  FramerTag,
  heroSubcopy,
  sectionHeadline,
  textMeta,
} from "@/components/framer-section";
import { MarketingSection } from "@/components/marketing-section";
import { TextReveal } from "@/components/text-reveal";
import { cn } from "@/lib/utils";

const teamHeroTitle =
  "reveal w-full text-balance text-center text-[30px] font-medium leading-[0.94] tracking-[-0.045em] text-white sm:text-[40px] md:text-[48px] lg:text-[52px]";

/** Iryna (1-7.jpg, team-07) — always first / centered in the carousel */
const TEAM_LEAD_ID = "iryna";

const team = [
  { id: TEAM_LEAD_ID, name: "Iryna", role: "Brand Strategy", photo: team07 },
  { id: "rm", name: "Kyryll", role: "Strategy · GTM", photo: team01 },
  { id: "al", name: "Nadya", role: "Creative Director", photo: team02 },
  { id: "kiryll", name: "Vlad", role: "Performance Lead", photo: team03 },
  { id: "jd", name: "Alex", role: "Brand Designer", photo: team04 },
  { id: "op", name: "Sasha", role: "Growth Strategy", photo: team05 },
  { id: "mk", name: "Julia", role: "Client Operations", photo: team06 },
] as const;

const carouselConfig = {
  ...DRAGABLE_CAROUSEL_DEFAULTS,
  slideWidth: 352,
  slideHeight: 448,
  inactiveOpacity: 0.45,
};

function TeamPortraitSlide({ person }: { person: (typeof team)[number] }) {
  return (
    <div className="rm-dragable-carousel__media rm-team-portrait overflow-hidden">
      <img
        src={person.photo}
        alt={person.name}
        draggable={false}
        className="pointer-events-none h-full w-full object-cover object-[center_20%]"
        loading="lazy"
        decoding="async"
      />
      <div className="rm-team-portrait__caption absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 px-4 pb-5 text-center">
        <p className="text-base font-semibold leading-snug tracking-[-0.02em] text-white">
          {person.name}
        </p>
        <p className={cn(textMeta, "text-white/55")}>{person.role}</p>
      </div>
    </div>
  );
}

function TeamCastCarousel() {
  return (
    <div className="reveal flex w-full min-w-0 flex-col items-center" data-delay="1">
      <DragableCarousel
        ariaLabel="Team members"
        className="rm-team-carousel max-w-[min(100%,56rem)]"
        clipSlides={false}
        config={carouselConfig}
        dotsPosition="below-cards"
      >
        {team.map((person) => (
          <TeamPortraitSlide key={person.id} person={person} />
        ))}
      </DragableCarousel>
    </div>
  );
}

export function TeamSection() {
  return (
    <MarketingSection ariaLabelledBy="team-heading">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="mx-auto flex w-full max-w-[40rem] flex-col items-center text-center">
          <p className="reveal mb-6 w-fit md:mb-8">
            <FramerTag>Team</FramerTag>
          </p>
          <TextReveal
            id="team-heading"
            text="The people who ship the work."
            className={teamHeroTitle}
          />
          <p
            className={cn(
              "reveal mt-7 mx-auto max-w-[34ch] text-balance text-center",
              heroSubcopy,
            )}
            data-delay="1"
          >
            <span className="block">Ten senior operators.</span>
            <span className="block">Every engagement is led, not delegated.</span>
          </p>
        </div>

        <div className="flex w-full justify-center">
          <TeamCastCarousel />
        </div>
      </div>
    </MarketingSection>
  );
}
