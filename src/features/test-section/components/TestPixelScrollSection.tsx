import {
  startTransition,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import flowerSvg from '@/assets/flower.svg';
import mushroomsPixelSvg from '@/assets/mushrooms-pixel.svg';

gsap.registerPlugin(ScrollTrigger);

type Slide = {
  key: 'flower' | 'mushrooms';
  heading: string;
  body: string;
  pixelSrc: string;
  pixelAlt: string;
};

export function TestPixelScrollSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo<Slide[]>(
    () => [
      {
        key: 'flower',
        heading: 'Where building with AI is as natural as thinking out loud.',
        body: [
          'I envision a future where anyone with an idea can harness the power of AI to bring it to life.',
          'A future where intelligent systems handle complexity, so creators can focus on what matters most.',
        ].join('\n\n'),
        pixelSrc: flowerSvg,
        pixelAlt: 'Pixel art flower',
      },
      {
        key: 'mushrooms',
        heading: 'Small experiments, compounding into something alive.',
        body: [
          'The best systems grow like mycelium: dense, interconnected, and resilient long before anything visible breaks the surface.',
          'I care about that hidden layer—data, evaluation, and infrastructure—so the product above ground feels effortless.',
        ].join('\n\n'),
        pixelSrc: mushroomsPixelSvg,
        pixelAlt: 'Pixel art mushrooms',
      },
    ],
    []
  );

  useLayoutEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextIndex = self.progress < 0.5 ? 0 : 1;
          queueMicrotask(() => {
            startTransition(() => {
              setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
            });
          });
        },
      });
    }, trackEl);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <section id="test" className="border-t border-border/30 px-4 py-16 sm:px-6 md:py-44">
      <div className="container mx-auto">
        <div ref={trackRef} className="relative min-h-[170vh] md:min-h-[160vh]">
          <div className="sticky top-[4vh] z-10 grid min-h-0 grid-cols-1 items-stretch gap-5 md:min-h-[68vh] md:grid-cols-2 md:gap-8 md:gap-y-0">
            <div className="relative min-h-[min(78vh,820px)] overflow-x-hidden overflow-y-auto rounded-3xl bg-card md:min-h-[min(68vh,720px)] md:overflow-hidden">
              {slides.map((slide, i) => (
                <div
                  key={slide.key}
                  className={[
                    'absolute inset-0 flex flex-col justify-start gap-4 overflow-y-auto p-5 transition-opacity duration-500 sm:p-6 md:justify-center md:gap-6 md:overflow-visible md:p-10',
                    i === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0',
                  ].join(' ')}
                >
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base whitespace-pre-line">
                    {slide.body}
                  </p>
                  <p className="mt-1 text-2xl font-normal leading-snug tracking-[-0.04em] font-serif italic sm:text-3xl sm:leading-tight md:mt-2 md:text-4xl md:leading-snug lg:text-5xl">
                    {slide.heading}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative min-h-[min(68vh,580px)] overflow-hidden rounded-3xl bg-card md:min-h-0">
              {slides.map((slide, i) => (
                <div
                  key={slide.key}
                  className={[
                    'absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-500 sm:p-6 md:p-10',
                    i === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0',
                  ].join(' ')}
                >
                  <div className="flex h-[min(60vh,500px)] w-full max-w-[min(100%,36rem)] items-center justify-center md:h-[min(56vh,480px)] md:max-w-md lg:max-w-lg">
                    <img
                      src={slide.pixelSrc}
                      alt={slide.pixelAlt}
                      className={[
                        'object-contain object-center',
                        slide.key === 'flower'
                          ? 'h-full max-h-full w-auto max-w-full'
                          : 'h-full max-h-full w-auto max-w-full origin-center scale-[1.82] sm:scale-[1.71] md:scale-[1.54] lg:scale-[1.41]',
                      ].join(' ')}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
