"use client";

import { QRA_STEPS, QRAStep } from "@/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import signalTowerImage from "../../../../public/signal-tower.png";
import { useLoadAnimation, useZoomAnimation } from "./animation";
import { Button } from "./button";
import { PIN_DATA, PinData } from "./data";
import UKMap from "./uk-map";

// -- Next steps --
// Handle co-ordinate response step click
// - Add a third base close to the lossiemouth base
// - Draw a line between the two bases
// - Add a third content section for co-ordinating response and animate in
// Handle asses situation button click
// -- New 5050 content overlay

// Enhancements
// Add the aircraft flying toward the map

const initialAnimationClasses = "opacity-0 origin-left scale-110 blur-sm";

export default function QRA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinContentRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<PinData | null>(null);
  const [activeStep, setActiveStep] = useState<QRAStep | null>(null);

  useLoadAnimation({ containerRef, contentRef, progressIndicatorRef });
  const zoomTl = useZoomAnimation({
    mapContainerRef,
    contentRef,
    pinContentRef,
    activePin,
    containerRef,
    progressIndicatorRef,
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

  const handleStepClick = (step: QRAStep) => {
    setActiveStep(step);
  };

  return (
    <>
      <div className="relative h-dvh min-h-[1080px] overflow-hidden pt-20">
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
                "scale-110 opacity-0" // initial animation class
              )}
              width={630}
              height={1000}
              viewBox="0 100 630 1000"
              data-map
            />
            {PIN_DATA.map((pin) => (
              <button
                key={pin.id}
                className={cn(
                  "bg-accent absolute size-4 cursor-pointer rounded-full",
                  "scale-200 opacity-0" // initial animation class
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
                  className="bg-accent/60 absolute inset-0 animate-ping rounded-full"
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
              <Button
                className={cn("mt-8", initialAnimationClasses)}
                onClick={() => handleStepClick("COORDINATE_RESPONSE")}
              >
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
                className="col-1 row-1 space-y-4"
                ref={pinContentRef}
              >
                <button
                  type="button"
                  className={cn(
                    "flex cursor-pointer items-center gap-1 text-sm underline",
                    initialAnimationClasses
                  )}
                  onClick={handleBackClick}
                >
                  <ArrowLeft className="size-3" />
                  <span>Back</span>
                </button>
                <h2
                  className={cn("text-3xl font-bold", initialAnimationClasses)}
                >
                  {activePin.content.title}
                </h2>
                <p className={cn("text-xl", initialAnimationClasses)}>
                  {activePin.content.description}
                </p>

                <Link
                  href={activePin.content.cta.href}
                  className={cn(
                    "inline-block text-sm underline",
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
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "sticky bottom-15.5 flex justify-center",
          "opacity-0" // initial animation class
        )}
        ref={progressIndicatorRef}
      >
        <ProgressIndicator activeStep={activeStep} />
      </div>
    </>
  );
}

function ProgressIndicator({ activeStep }: { activeStep: QRAStep | null }) {
  const steps = Object.entries(QRA_STEPS);

  return (
    <div className="bg-background text-foreground inline-flex justify-center rounded-[20px] px-8 py-5 shadow-xl">
      <ol className="flex w-auto gap-12.5 font-bold">
        {steps.map(([step, label], index) => (
          <Fragment key={step}>
            <li className="relative" data-animate>
              <span>{label}</span>
              <div
                aria-hidden
                className={cn(
                  "bg-accent absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-700",
                  activeStep === step && "scale-x-100"
                )}
              />
            </li>
            {index < steps.length - 1 && <ArrowRight data-animate />}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}
