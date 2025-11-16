"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import signalTowerImage from "../../../../public/signal-tower.png";
import { useLoadAnimation, useZoomAnimation } from "./animation";
import { Button } from "./button";
import { PIN_DATA, PinData } from "./data";
import UKMap from "./uk-map";

// -- Next steps --
// Add the progress indicator at the bottom (sticky)

export default function QRA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinContentRef = useRef<HTMLDivElement>(null);
  const initialAnimationClasses = "opacity-0 origin-left scale-110 blur-sm";
  const [activePin, setActivePin] = useState<PinData | null>(null);

  useLoadAnimation({ containerRef, contentRef });
  const zoomTl = useZoomAnimation({
    mapContainerRef,
    contentRef,
    pinContentRef,
    activePin,
    containerRef,
  });

  const handlePinClick = (pin: PinData) => {
    setActivePin(pin);
  };

  const handleBackClick = () => {
    if (!zoomTl.current) return;

    // Reverse the timeline animation
    zoomTl.current.reverse().then(() => {
      // Reset active pin after animation completes
      setActivePin(null);
    });
  };

  return (
    <div className="mx-auto pt-20 h-dvh min-h-[1080px] overflow-hidden">
      <div
        ref={containerRef}
        className="container mx-auto grid grid-cols-[auto_1fr]"
      >
        <div ref={mapContainerRef} className="relative">
          {/* Got this colour from the map using a color picker.
        Does not seem to be part of the design system so I am inlining it here. */}
          <UKMap
            className={cn(
              "fill-[hsl(210_8.82%_26.67%)]",
              "opacity-0 scale-110" // initial animation class
            )}
            data-map
          />
          {PIN_DATA.map((pin) => (
            <button
              key={pin.id}
              className={cn(
                "absolute cursor-pointer size-4 bg-accent rounded-full",
                "opacity-0 scale-200" // initial animation class
              )}
              data-pin
              aria-label={pin.name}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onClick={() => handlePinClick(pin)}
              disabled={!!activePin}
            >
              <span className="sr-only">{pin.name}</span>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-accent/60 rounded-full animate-ping"
              />
            </button>
          ))}
        </div>
        {/* Right Side content section */}
        <div className="isolate grid grid-cols-1 grid-rows-1 items-center">
          {/* Initial content  */}
          <div ref={contentRef} className="col-1 row-1 space-y-4">
            {/* Typically I would not use an next/image for this type of thing but an SVG.
            Also I would rarely use the next.js public directory because there is usually a cheaper way
            to store and process (hence the unoptimized prop) images e.g. through a DAM */}
            <Image
              src={signalTowerImage}
              alt="Signal Tower icon"
              className={cn("size-[64px]", initialAnimationClasses)}
              unoptimized
            />
            {/* Decided not to go with the design system typography for this demo. 
            I have increased from the designs 33px to 48px to create better hierarchy. */}
            <h1 className={cn("text-5xl font-bold", initialAnimationClasses)}>
              Threat detected
            </h1>
            <p className={cn("text-3xl", initialAnimationClasses)}>
              A rogue aircraft approaches UK airspace.
            </p>
            <Button className={cn("mt-8", initialAnimationClasses)}>
              <span>Co-ordinate response</span>
            </Button>
          </div>

          {/* Pin content */}
          {/* While I have not included it here. It would be very simple to include images (eg the RAF base logos in the design) in pin content derived from the pin data.
          e.g. <Image src={activePin.image} alt={activePin.name} width={100} height={100} />
          To focus more on the animations and functionality I have left the content quite basic but extensibility is built in */}
          {activePin && (
            <div
              key={activePin.id}
              className="space-y-4 col-1 row-1"
              ref={pinContentRef}
            >
              <button
                type="button"
                className={cn(
                  "underline flex gap-1 items-center text-sm cursor-pointer",
                  initialAnimationClasses
                )}
                onClick={handleBackClick}
              >
                <ArrowLeft className="size-3" />
                <span>Back</span>
              </button>
              <h2 className={cn("text-3xl font-bold", initialAnimationClasses)}>
                {activePin.content.title}
              </h2>
              <p className={cn("text-xl", initialAnimationClasses)}>
                {activePin.content.description}
              </p>

              <Link
                href={activePin.content.cta.href}
                className={cn(
                  "inline-block underline text-sm",
                  initialAnimationClasses
                )}
              >
                {activePin.content.cta.label}
              </Link>
              {activePin.content.youtubeVideoId && (
                <div
                  className={cn(
                    "aspect-video w-full max-w-2xl",
                    initialAnimationClasses
                  )}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${activePin.content.youtubeVideoId}`}
                    title={`${activePin.content.title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
