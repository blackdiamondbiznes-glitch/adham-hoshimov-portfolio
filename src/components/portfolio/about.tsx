import { motion, useReducedMotion } from "framer-motion";
import { Layers, MonitorPlay, Send, Sparkles, type LucideIcon } from "lucide-react";
import { driveImageUrl } from "@/lib/media";
import { useContent } from "@/lib/locale";

const pointIcons: LucideIcon[] = [Layers, Send, MonitorPlay];

export function About() {
  const reduce = useReducedMotion();
  const { copy } = useContent();
  const photo = driveImageUrl(copy.profileImage);

  return (
    <section id="haqimda" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <p className="kicker">{copy.aboutKicker}</p>
        <div className="mt-8 grid items-stretch gap-3 md:grid-cols-6">
          <motion.article
            className="about-card md:col-span-4"
            {...reveal(reduce, 0)}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Portrait photo={photo} alt={copy.profileAlt} initials={copy.initials} />
              <div className="min-w-0">
                <h2 className="about-title">{copy.aboutTitle}</h2>
                <p className="muted mt-3 text-sm">
                  {copy.age} {copy.ageLabel}
                </p>
                <p className="soft mt-4 text-base leading-relaxed md:text-[17px]">
                  {copy.aboutLead}
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article className="about-card about-card-accent md:col-span-2" {...reveal(reduce, 0.08)}>
            <Sparkles className="accent-icon size-5" aria-hidden="true" />
            <h3 className="fg mt-4 text-lg font-semibold tracking-tight">{copy.summaryLabel}</h3>
            <p className="soft mt-3 text-base leading-relaxed">{copy.aboutClose}</p>
          </motion.article>

          {copy.aboutPoints.map((point, index) => {
            const Icon = pointIcons[index] ?? Sparkles;
            return (
              <motion.article
                key={point.title}
                className="about-card md:col-span-2"
                {...reveal(reduce, 0.12 + index * 0.06)}
              >
                <span className="icon-well grid size-10 place-items-center rounded-2xl">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="fg mt-4 text-lg font-semibold tracking-tight">{point.title}</h3>
                <p className="soft mt-2 text-base leading-relaxed">{point.detail}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Portrait({ photo, alt, initials }: { photo: string | null; alt: string; initials: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={alt}
        width={160}
        height={160}
        loading="lazy"
        decoding="async"
        className="size-28 shrink-0 rounded-3xl object-cover ring-1 ring-[color:var(--pf-line-strong)] sm:size-36"
      />
    );
  }

  return (
    <div
      className="accent-fill grid size-28 shrink-0 place-items-center rounded-3xl text-3xl font-semibold sm:size-36"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function reveal(reduce: boolean | null, delay: number) {
  return {
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.5, delay, ease: [0.2, 0, 0, 1] as const },
  };
}
