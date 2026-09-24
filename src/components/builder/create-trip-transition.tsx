"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Trip } from "@/types/travel";
import { countryById, cityById } from "@/data/catalog";
import { TripBento } from "@/components/overview/trip-bento";
import { tripEstimate } from "@/lib/trips";
import { formatMoney, formatTripDates } from "@/lib/format";
import { DestinationPhoto } from "@/components/overview/destination-photo";
import styles from "./create-trip-transition.module.css";
export function CreateTripTransition({ trip }: { trip: Trip }) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const [chapter, setChapter] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    focusRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
    router.prefetch("/trips/" + trip.id);
    const assemble = window.setTimeout(
      () => setAssembled(true),
      reduced ? 0 : 5200,
    );
    const chapters = [1600, 3400].map((delay, index) =>
      window.setTimeout(() => setChapter(index + 1), delay),
    );
    const navigate = window.setTimeout(
      () => router.replace("/trips/" + trip.id, { scroll: false }),
      reduced ? 600 : 10800,
    );
    return () => {
      chapters.forEach(clearTimeout);
      clearTimeout(assemble);
      clearTimeout(navigate);
    };
  }, [trip.id, reduced, router]);
  const estimate = tripEstimate(trip);
  const cards = [
    {
      id: "hero",
      title: countryById[trip.countryIds[0]]!.name,
      detail: trip.name,
    },
    {
      id: "dates",
      title: trip.totalDays + " days",
      detail: formatTripDates(trip.startDate, trip.endDate),
    },
    {
      id: "travelers",
      title: trip.travelers.length + " travelers",
      detail: "Your favorite company",
    },
    {
      id: "route",
      title: "Your route",
      detail: trip.route.map((s) => cityById[s.cityId]!.name).join(" / "),
    },
    {
      id: "budget",
      title: formatMoney(estimate.min) + " - " + formatMoney(estimate.max),
      detail: "Estimated land budget",
    },
  ];
  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      className={styles.stage}
      aria-label="Creating your trip"
      aria-busy="true"
    >
      <div className={styles.status} data-assembled={assembled}>
        <p role="status">
          {assembled
            ? "Your next chapter is ready."
            : [
                "Bringing your adventure together...",
                "Connecting the places you chose...",
                "Making room for every little detail...",
              ][chapter]}
        </p>
        <div className={styles.track} aria-hidden="true">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0.2 : 5.2, ease: "easeInOut" }}
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        {assembled ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.18 : 0.65 }}
          >
            <TripBento trip={trip} assembling />
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            className={styles.collection}
            exit={{
              opacity: 0,
              y: reduced ? 0 : -24,
              filter: reduced ? "blur(0px)" : "blur(5px)",
            }}
            transition={{ duration: reduced ? 0.12 : 0.85, ease: "easeInOut" }}
          >
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                className={styles.piece}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 100, rotate: (i - 2) * 5 }
                }
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: [0, -12, 0],
                        rotate: [0, i % 2 ? 0.8 : -0.8, 0],
                      }
                }
                transition={{
                  opacity: { duration: 0.7, delay: reduced ? 0 : i * 0.16 },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.16,
                  },
                  rotate: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.16,
                  },
                  layout: { duration: 1.4 },
                }}
              >
                {card.id === "hero" && (
                  <div className={styles.photo}>
                    <DestinationPhoto
                      src={countryById[trip.countryIds[0]]!.image}
                      priority
                    />
                  </div>
                )}
                <strong>{card.title}</strong>
                <p>{card.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
