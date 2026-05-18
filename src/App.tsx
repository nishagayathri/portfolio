/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import Hls from 'hls.js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import heroVideoSrc from '@/assets/hero.mp4';
import { HeroFloatingIcons } from '@/src/components/HeroFloatingIcons';
import { CareerTimelineSection } from '@/src/features/career-timeline/components/CareerTimelineSection';
import { TestPixelScrollSection } from '@/src/features/test-section/components/TestPixelScrollSection';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const WordReveal = ({ text, className }: { text: string; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  
  return (
    <div ref={containerRef} className={cn("flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em]", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        
        const isHighlight = ["curiosity", "meets", "clarity"].includes(word.toLowerCase().replace(/[—,.]/g, ""));
        
        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className={cn(
              isHighlight ? "text-foreground" : "text-[hsl(var(--hero-subtitle))]"
            )}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
};

const HlsVideo = ({ src, className }: { src: string; className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      autoPlay
    />
  );
};

export default function App() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroMuted, setHeroMuted] = useState(false);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = heroMuted;
    const playAttempt = video.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        if (!heroMuted) {
          setHeroMuted(true);
          video.muted = true;
        }
        void video.play().catch(() => {});
      });
    }
  }, [heroMuted]);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* 1. Hero Section */}
      <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <video
          ref={heroVideoRef}
          autoPlay
          loop
          muted={heroMuted}
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />

        <button
          type="button"
          onClick={() => setHeroMuted((m) => !m)}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/25 bg-background/40 text-foreground shadow-md backdrop-blur-md transition-colors hover:bg-background/55 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:top-6 md:right-6"
          aria-pressed={!heroMuted}
          aria-label={heroMuted ? 'Unmute hero video' : 'Mute hero video'}
        >
          {heroMuted ? (
            <VolumeX className="h-4 w-4" aria-hidden />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden />
          )}
        </button>

        <HeroFloatingIcons />

        <div className="pointer-events-none relative z-10 flex w-full flex-col items-center px-6 text-center">
          <motion.h1
            {...fadeUp(0)}
            className="mx-auto w-full max-w-4xl text-center text-4xl font-medium tracking-[-2px] md:text-6xl lg:text-7xl"
          >
            <span className="inline-block translate-x-[0.035em]">
              I'm Nisha
            </span>
          </motion.h1>
        </div>
      </section>

      {/* 2. Core Expertise Section */}
      <section id="research" className="container mx-auto px-6 pt-52 pb-6 md:pt-64 md:pb-9">
        <motion.div {...fadeUp(0)} className="text-center">
          <h2 className="text-5xl font-medium tracking-tight md:text-7xl lg:text-8xl">
            Intelligence is <span className="font-serif font-normal italic">evolving.</span> Are you?
          </h2>
          <p className="mx-auto mt-8 mb-24 max-w-2xl text-lg text-muted-foreground">
            I focus on the intersection of deep learning and practical application, ensuring AI systems are robust, ethical, and highly performant.
          </p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {[
            { name: "LLM Fine-tuning", desc: "Optimizing models for domain-specific tasks with high precision.", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
            { name: "RAG Systems", desc: "Building enterprise-grade retrieval-augmented generation pipelines.", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Perplexity_AI_logo.svg/1024px-Perplexity_AI_logo.svg.png" },
            { name: "Neural Architecture", desc: "Designing custom neural networks for edge and cloud environments.", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png" }
          ].map((expertise, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(0.1 * i)}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-8 flex h-[200px] w-[200px] items-center justify-center rounded-2xl bg-card p-12">
                <img src={expertise.icon} alt={expertise.name} className="h-full w-full object-contain invert" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-base font-semibold">{expertise.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{expertise.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.5)} className="mt-20 text-center text-sm text-muted-foreground">
          If you don't build the future, someone else will.
        </motion.p>
      </section>

      {/* 3. Philosophy Section */}
      <section
        id="about"
        className="relative flex flex-col items-center px-6 pt-0 pb-32 md:pb-44"
      >
        <div className="mb-20 h-[400px] w-[400px] md:h-[800px] md:w-[800px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-contain"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-5xl text-center">
          <WordReveal 
            text="I believe in building AI that is not just powerful, but purposeful — where complex algorithms meet human intuition, and every model serves a greater goal."
            className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl"
          />
          
          <motion.p 
            {...fadeUp(0.2)}
            className="mt-10 text-xl font-medium text-[hsl(var(--hero-subtitle))] md:text-2xl lg:text-3xl"
          >
            A commitment to excellence, transparency, and the relentless pursuit of breakthroughs in artificial intelligence.
          </motion.p>
        </div>
      </section>

      <CareerTimelineSection />

      <TestPixelScrollSection />

      {/* 4. Featured Showcase Section */}
      <section id="showcase" className="border-t border-border/30 px-6 py-32 md:py-44">
        <div className="container mx-auto">
          <motion.div {...fadeUp(0)} className="mb-16">
            <span className="text-xs font-bold tracking-[3px] text-muted-foreground uppercase">
              SHOWCASE
            </span>
            <h2 className="mt-6 text-5xl font-medium tracking-tight md:text-7xl">
              Selected <span className="font-serif font-normal italic">Works</span>
            </h2>
          </motion.div>

          <div className="grid gap-12">
            {/* Featured Project 1 - Large */}
            <motion.div 
              {...fadeUp(0.1)}
              className="group relative h-[600px] w-full overflow-hidden rounded-3xl bg-card"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
              >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <div className="mb-4 flex flex-wrap gap-2">
                  {["PyTorch", "Distributed Systems", "LLMs"].map(tag => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-medium md:text-5xl">Neural Nexus</h3>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                  A distributed training framework designed for multi-modal large language models, achieving 40% faster convergence on petascale datasets.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                >
                  Explore Case Study <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Grid for smaller featured projects */}
            <div className="grid gap-12 md:grid-cols-2">
              {[
                {
                  title: "Semantic Search",
                  tags: ["RAG", "Vector DB", "FastAPI"],
                  desc: "Enterprise-grade retrieval-augmented generation solution with sub-second latency across massive document stores.",
                  video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
                },
                {
                  title: "Agentic OS",
                  tags: ["Multi-Agent", "AutoGPT", "Python"],
                  desc: "Autonomous multi-agent systems designed for complex workflow automation and decision-making processes.",
                  video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
                }
              ].map((project, i) => (
                <motion.div 
                  key={i}
                  {...fadeUp(0.2 + i * 0.1)}
                  className="group relative h-[450px] overflow-hidden rounded-3xl bg-card"
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-medium md:text-3xl">{project.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {project.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Projects Archive Section */}
      <section id="projects" className="border-t border-border/30 px-6 py-32 md:py-44">
        <div className="container mx-auto">
          <motion.span {...fadeUp(0)} className="text-xs font-bold tracking-[3px] text-muted-foreground uppercase">
            ARCHIVE
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="mt-6 mb-16 text-4xl font-medium md:text-6xl">
            More <span className="font-serif font-normal italic">Explorations</span>
          </motion.h2>

          <motion.div {...fadeUp(0.2)} className="mb-20 overflow-hidden rounded-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="aspect-[3/1] w-full object-cover"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4" type="video/mp4" />
            </video>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { title: "Neural Nexus", desc: "A distributed training framework for multi-modal large language models." },
              { title: "Semantic Search", desc: "Enterprise-grade RAG solution with sub-second latency across petabytes." },
              { title: "Vision Flow", desc: "Real-time object detection and tracking optimized for edge computing." },
              { title: "Agentic OS", desc: "Autonomous multi-agent systems for complex workflow automation." }
            ].map((project, i) => (
              <motion.div key={i} {...fadeUp(0.3 + i * 0.1)}>
                <h3 className="text-base font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{project.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section id="contact" className="relative flex flex-col items-center justify-center overflow-hidden border-t border-border/30 py-32 md:py-44">
        <HlsVideo 
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" 
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-[1] bg-background/45" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div {...fadeUp(0)} className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/60">
            <div className="h-5 w-5 rounded-full border border-foreground/60" />
          </motion.div>

          <motion.h2 {...fadeUp(0.1)} className="text-5xl font-medium md:text-7xl">
            Let's Build the <span className="font-serif font-normal italic">Future</span>
          </motion.h2>
          
          <motion.p {...fadeUp(0.2)} className="mt-6 mb-12 max-w-md text-muted-foreground">
            Open for collaborations, research partnerships, and high-impact AI engineering roles.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95">
              Contact Me
            </button>
            <button className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-bold transition-transform hover:scale-105 active:scale-95">
              View GitHub
            </button>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="flex flex-col items-center justify-between gap-6 px-8 py-12 md:flex-row md:px-28">
        <p className="text-sm text-muted-foreground">
          © 2026 AI Portfolio. All rights reserved.
        </p>
        <div className="flex gap-8">
          {["LinkedIn", "GitHub", "Twitter"].map((link) => (
            <a key={link} href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
