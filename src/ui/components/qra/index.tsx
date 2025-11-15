"use client";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import signalTowerImage from "../../../../public/signal-tower.png";
import { Button } from "./button";
import UKMap from "./uk-map";

gsap.registerPlugin(useGSAP);

// Next steps
// Add the progress indicator at the bottom (sticky)
// Set up pin data
// Add pins to the map
// Make pints interactive
// Add back functionality when clicking a pin

export default function QRA() {
  const { containerRef, initialAnimationClasses, mapRef } = useLoadAnimation();

  return (
    <div className="container mx-auto pt-20 h-dvh overflow-hidden">
      <div className="grid grid-cols-2">
        {/* Got this colour from the map using a color picker.
        Does not seem to be part of the design system so I am inlining it here. */}
        <UKMap
          className={cn(
            "fill-[hsl(210_8.82%_26.67%)]",
            "opacity-0 scale-110" // initial animation class
          )}
          ref={mapRef}
        />
        {/* Right Side content section */}
        <div ref={containerRef} className="my-auto space-y-4">
          {/* Typically I would not use an next/image for this type of thing but an SVG.
          Also I would rarely use the next.js public directory because there is usually a cheaper way
          to store and process (hence the unoptimized prop) images e.g. through a DAM */}
          <Image
            src={signalTowerImage}
            alt="Signal Tower icon"
            className={cn("size-[64px]", initialAnimationClasses)}
            unoptimized
            data-animate
          />
          {/* Decided not to go with the design system typography for this demo. 
          I have increased from the designs 33px to 48px to create better hierarchy. */}
          <h1
            className={cn("text-5xl font-bold", initialAnimationClasses)}
            data-animate
          >
            Threat detected
          </h1>
          <p className={cn("text-3xl", initialAnimationClasses)} data-animate>
            A rogue aircraft approaches UK airspace.
          </p>
          <Button className={cn("mt-8", initialAnimationClasses)} data-animate>
            <span>Co-ordinate response</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function useLoadAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const tl = useRef<GSAPTimeline>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const initialAnimationClasses = "opacity-0 origin-left scale-110 blur-sm";

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Instantly show all content without animation
        gsap.set([mapRef.current, "[data-animate]"], {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }

      tl.current = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.current
        .to(mapRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
        })
        .to(
          mapRef.current,
          {
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.15))",
            duration: 0.6,
          },
          "<+0.5"
        )
        .to(
          "[data-animate]",
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            stagger: 0.15,
            duration: 0.6,
            ease: "back.out(1.1)",
          },
          "<+0.3"
        );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return { containerRef, initialAnimationClasses, mapRef, tl };
}
