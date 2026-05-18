import { useMemo, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

type CareerEntry = {
  year: string;
  title: string;
  description: string;
};

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function padProgress(t: number, pad: number) {
  const start = clamp01(t - pad);
  const end = clamp01(t);
  if (end <= start) return [start, start + 1e-6] as const;
  return [start, end] as const;
}

type CareerMilestoneBlockProps = {
  entry: CareerEntry;
  milestoneIndex: number;
  threshold: number;
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean | null;
};

function CareerMilestoneBlock({
  entry,
  milestoneIndex,
  threshold,
  scrollYProgress,
  reduceMotion,
}: CareerMilestoneBlockProps) {
  const [a, b] = padProgress(threshold, 0.07);
  const opacity = useTransform(
    scrollYProgress,
    reduceMotion ? [0, 1] : [a, b],
    reduceMotion ? [1, 1] : [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    reduceMotion ? [0, 1] : [a, b],
    reduceMotion ? [0, 0] : [18, 0]
  );

  const alignRight = milestoneIndex % 2 === 1;

  return (
    <motion.article
      style={{ opacity, y }}
      className={[
        'flex flex-col gap-4 rounded-2xl border border-border/35 bg-card/50 px-5 py-6 backdrop-blur-sm md:flex-row md:items-baseline md:gap-10 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none',
        alignRight ? 'md:flex-row-reverse' : '',
      ].join(' ')}
    >
      <div
        className={[
          'shrink-0 font-serif text-4xl tabular-nums tracking-tight text-foreground/90 md:w-36 md:text-5xl',
          alignRight ? 'md:text-right' : '',
        ].join(' ')}
      >
        {entry.year}
      </div>
      <div className={['min-w-0 flex-1', alignRight ? 'md:text-right' : ''].join(' ')}>
        <h3 className="text-lg font-semibold leading-snug md:text-xl">{entry.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          {entry.description}
        </p>
      </div>
    </motion.article>
  );
}

export function CareerTimelineSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const entries = useMemo<CareerEntry[]>(
    () => [
      {
        year: '2019',
        title: 'First deep dive into AI',
        description:
          'Started building small ML projects and learning the fundamentals of training, evaluation, and data quality.',
      },
      {
        year: '2021',
        title: 'Shipped production ML',
        description:
          'Moved from notebooks to systems: model packaging, monitoring, and reliable pipelines that work under real constraints.',
      },
      {
        year: '2023',
        title: 'LLMs and retrieval',
        description:
          'Built RAG prototypes, experimented with fine-tuning, and focused on practical, measurable quality improvements.',
      },
      {
        year: '2026',
        title: 'AI engineering focus',
        description:
          'Designing robust, scalable AI systems that balance capability, safety, and product impact.',
      },
    ],
    []
  );

  const thresholds = useMemo(() => {
    const n = entries.length;
    if (n <= 1) return [0];
    return entries.map((_, i) => i / (n - 1));
  }, [entries]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  return (
    <section
      ref={sectionRef}
      id="career"
      className="border-t border-border/30 px-6 pt-24 pb-28 md:pt-32 md:pb-44"
      aria-labelledby="career-heading"
    >
      <div className="container mx-auto">
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-bold tracking-[3px] text-muted-foreground uppercase">
            CAREER
          </span>
          <h2
            id="career-heading"
            className="mt-6 text-4xl font-medium tracking-tight md:text-6xl"
          >
            Career <span className="font-serif font-normal italic">Timeline</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Scroll to reveal each chapter—no connectors, just the milestones that matter.
          </p>
        </div>

        <div className="relative min-h-[200vh]">
          <ol className="sticky top-[12vh] mx-auto flex max-w-3xl list-none flex-col gap-12 pb-24 md:gap-20 md:pb-32">
            {entries.map((entry, i) => (
              <li key={entry.year}>
                <CareerMilestoneBlock
                  entry={entry}
                  milestoneIndex={i}
                  threshold={thresholds[i] ?? 0}
                  scrollYProgress={scrollYProgress}
                  reduceMotion={reduceMotion}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
