import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceCard } from "@/components/PlaceCard";
import { HubPostCard } from "@/components/HubPostCard";

import { useCategories, useHubPosts, usePlaces } from "@/hooks/useApi";

import { CategoryCardSkeleton } from "@/components/CategoryCardSkeleton";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[26px] font-bold tracking-tight text-ink sm:text-[32px] lg:text-[38px]"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-2 max-w-xl text-sm leading-relaxed text-ink-faint"
          >
            {description}
          </motion.p>
        )}
      </div>

      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const floatingShapeOne = Math.min(180, Math.max(0, scrollY * 0.2));
  const floatingShapeTwo = Math.min(140, Math.max(-140, -scrollY * 0.14));

  const { data: categories, loading: catsLoading } = useCategories();

  const { data: popular, loading: placesLoading } = usePlaces(
    "?featured=true&limit=8",
  );

  const { data: communityPosts, loading: communityLoading } = useHubPosts(
    "?sort=mostLiked&limit=4",
  );

  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const spotlightItems = useMemo(
    () => [
      ...(popular?.items ?? []).slice(0, 6).map((item) => ({
        kind: "place" as const,
        item,
      })),

      ...(communityPosts?.items ?? []).slice(0, 4).map((item) => ({
        kind: "post" as const,
        item,
      })),
    ],
    [popular?.items, communityPosts?.items],
  );

  const spotlightPageCount = Math.max(1, spotlightItems.length - 2);

  useEffect(() => {
    if (spotlightItems.length <= 3) return;

    const timer = window.setInterval(() => {
      setSpotlightIndex((current) =>
        current + 1 >= spotlightPageCount ? 0 : current + 1,
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [spotlightItems.length, spotlightPageCount]);

  const visibleSpotlight = spotlightItems.slice(
    spotlightIndex,
    spotlightIndex + 3,
  );

  return (
    <div className="relative overflow-hidden bg-[#fcfaf6]">
      {/* Decorative moving background */}
      <motion.div
        animate={{
          y: [0, floatingShapeOne - 18, floatingShapeOne],
          x: [0, 12, 0],
          rotate: [0, 6, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-40 top-[600px] h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, floatingShapeTwo + 24, floatingShapeTwo],
          x: [0, -14, 0],
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-40 top-[1400px] h-[360px] w-[360px] rounded-full bg-[#e7b56b]/10 blur-3xl"
      />

      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[7%] top-24 h-24 w-24 rounded-full bg-[#f4cf92]/25 blur-2xl"
      />

      {/* HERO */}

      <HeroSection />

      {/* CATEGORIES */}

      <section className="relative mx-auto max-w-[1500px] px-5 pb-10 pt-12 md:px-10 lg:pt-16">
        <SectionReveal>
          <SectionHeading
            eyebrow="Explore campus"
            title="Find what matters to you"
            description="Food, services, events, opportunities, and everything students are sharing around campus."
          />
        </SectionReveal>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#fcfaf6] to-transparent md:hidden" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#fcfaf6] to-transparent md:hidden" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {catsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full">
                    <CategoryCardSkeleton />
                  </div>
                ))
              : categories?.items.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                    animate={{
                      y: [0, -4, 0],
                    }}
                    whileHover={{
                      y: -8,
                      rotate: -1,
                    }}
                    className="w-full"
                  >
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* BIG STATEMENT */}

      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:py-16">
        <div className="mx-auto max-w-[1500px]">
          <SectionReveal>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-[36px] bg-primary px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-20"
            >
              <motion.div
                animate={{
                  rotate: [0, 4, 0],
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
              />

              <motion.div
                animate={{
                  rotate: [0, -6, 0],
                  x: [0, -15, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -bottom-24 left-[45%] h-80 w-80 rounded-full bg-[#e9bd76]/20 blur-3xl"
              />

              <div className="relative z-10 max-w-4xl">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                  Campus life, in one place
                </p>

                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  className="text-[42px] font-bold leading-[0.95] tracking-tight sm:text-[58px] lg:text-[76px]"
                >
                  Eat.
                  <br />
                  Explore.
                  <br />
                  <span className="text-[#f1c98b]">Connect.</span>
                </motion.h2>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                  Discover the places students love, find opportunities, and
                  stay connected with what is happening around campus.
                </p>

                <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/students-hub"
                    className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                  >
                  Explore the community
                    <span className="ml-2">→</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* CAMPUS HIGHLIGHTS */}

      <section className="relative mx-auto max-w-[1500px] px-5 py-12 md:px-10 lg:py-20">
        <SectionReveal>
          <SectionHeading
            eyebrow="Happening now"
            title="What students are sharing"
            description="A live mix of popular places and community posts."
            action={
              <Link
                to="/students-hub"
                className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-5 py-2.5 text-xs font-bold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white"
              >
                Open student hub
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            }
          />
        </SectionReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {communityLoading || placesLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[360px] animate-pulse rounded-[24px] bg-white"
                />
              ))
            : visibleSpotlight.map((entry, index) => (
                <motion.div
                  key={`${entry.kind}-${entry.item.id}`}
                  initial={{
                    opacity: 0,
                    y: 35,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                  }}
                  className="min-w-0"
                >
                  {entry.kind === "place" ? (
                    <PlaceCard place={entry.item} variant="rail" />
                  ) : (
                    <HubPostCard post={entry.item} />
                  )}
                </motion.div>
              ))}
        </div>

        {spotlightItems.length > 3 && (
          <div className="mt-7 flex items-center justify-center gap-2">
            {Array.from({
              length: spotlightPageCount,
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSpotlightIndex(index)}
                aria-label={`Show highlights ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  spotlightIndex === index
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-primary/20 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* POPULAR PLACES */}

      <section className="relative border-y border-[#eee5d9] bg-[#f7f3ec] py-12 lg:py-20">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionReveal>
            <SectionHeading
              eyebrow="Student favorites"
              title="Popular places right now"
              description="The places students are visiting, recommending, and talking about."
              action={
                <Link
                  to="/home"
                  className="group inline-flex items-center gap-2 text-xs font-bold text-primary"
                >
                  See all places
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              }
            />
          </SectionReveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {placesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <PlaceCardSkeleton key={i} />
                ))
              : popular?.items.slice(0, 8).map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: (index % 4) * 0.08,
                    }}
                    whileHover={{
                      y: -10,
                      scale: 1.015,
                    }}
                  >
                    <PlaceCard place={place} />
                  </motion.div>
                ))}

            {!placesLoading && popular?.items.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-ink-faint">
                No places have been added yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="px-5 py-16 md:px-10 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <SectionReveal>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-[36px] border border-[#eadcc1] bg-[#fffdf9] px-6 py-12 text-center shadow-soft sm:px-10 lg:px-16"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Your campus, connected
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-[32px] font-bold leading-tight tracking-tight text-ink sm:text-[44px]">
                There is always something happening around you.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-faint">
                Find places. Discover opportunities. Share what matters with
                other students.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/students-hub"
                    className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    Join the community
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/home"
                    className="rounded-full border border-primary/15 px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
                  >
                    Explore places
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

    </div>
  );
}
