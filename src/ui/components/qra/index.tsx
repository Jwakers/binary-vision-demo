"use client";

import { QRAStep } from "@/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import lossiemouthInsigniaImage from "~/public/lossiemouth-insignia.png";
import rafJetImage from "~/public/raf-jet.jpg";
import signalTowerImage from "~/public/signal-tower.png";
import {
  useAnimatePathTransition,
  useLoadAnimation,
  useZoomAnimation,
} from "./animation";
import { Button } from "./button";
import { PIN_DATA, PinData } from "./data";
import { Overlay } from "./overlay";
import ProgressIndicator from "./progress-indicator";
import UKMap from "./uk-map";

// -- Next steps --
// Handle scramble jets button click

// Enhancements
// Add the aircraft flying toward the map
// As part of the path animation, zoom the map to the two pins
// Add overlay back button
// Treat modals as portals to more easily manipulate the background content

const initialAnimationClasses = "opacity-0 origin-left scale-110 blur-sm";

export default function QRA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const secondaryContentRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinContentRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activePin, setActivePin] = useState<PinData | null>(null);
  const [activeStep, setActiveStep] = useState<QRAStep | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useLoadAnimation({ containerRef, contentRef, progressIndicatorRef });
  const zoomTl = useZoomAnimation({
    mapContainerRef,
    contentRef,
    pinContentRef,
    activePin,
    containerRef,
    progressIndicatorRef,
  });
  const pathTl = useAnimatePathTransition({
    pathRef,
    mapContainerRef,
    contentRef,
    secondaryContentRef,
    pinData: PIN_DATA,
  });

  useEffect(() => {
    if (!zoomTl.current || !activePin) return;
    zoomTl.current.play();
  }, [activePin, zoomTl, pathTl]);

  const handlePinClick = (pin: PinData) => {
    // If time were not a restraint here I would add more accessibility features such as keyboard navigation and more aria-labels.
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
    pathTl.current?.play();
  };

  return (
    <>
      <div
        data-animate-overlay
        className="relative h-dvh min-h-[1080px] overflow-hidden pt-20"
      >
        <div
          ref={containerRef}
          className="container mx-auto grid h-full grid-cols-[auto_1fr]"
        >
          <div ref={mapContainerRef} className="relative self-center">
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
            <div className="absolute inset-0">
              {/* This SVG acts as an overlay in which we can programmatically draw lines between pins. */}
              <svg
                className={cn(
                  "text-accent size-full",
                  "opacity-0" // initial animation class
                )}
              >
                <path
                  ref={pathRef}
                  d="M 0 0 Q 200 50, 350 150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {PIN_DATA.map((pin) => (
              <Pin
                key={pin.id}
                pin={pin}
                onClick={() => handlePinClick(pin)}
                disabled={!!activePin || !!activeStep}
              />
            ))}
          </div>
          {/* Right Side content section */}
          <div className="isolate grid grid-cols-1 grid-rows-1 items-center">
            {/* Initial content  */}
            <div className="col-1 row-1 space-y-4" ref={contentRef}>
              <ContentSection
                title="Threat detected"
                description="A rogue aircraft approaches UK airspace."
                image={signalTowerImage}
                imageAlt="Signal Tower icon"
                cta="Co-ordinate response"
                onClick={() => handleStepClick("COORDINATE_RESPONSE")}
              />
            </div>

            {/* Secondary content */}
            <div
              className="col-1 row-1 space-y-4"
              ref={secondaryContentRef}
              inert
            >
              <ContentSection
                title="Co-ordinate response"
                description="RAF Boulmer identifies the rogue aircraft."
                cta="Assess situation"
                onClick={() => setShowOverlay(true)}
              />
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
                inert
              >
                <button
                  type="button"
                  className={cn(
                    "flex cursor-pointer items-center gap-1 text-sm underline",
                    initialAnimationClasses
                  )}
                  onClick={handleBackClick}
                  aria-hidden="true"
                >
                  <ArrowLeft className="size-3" />
                  <span>Back</span>
                </button>
                <h2
                  className={cn("text-3xl font-bold", initialAnimationClasses)}
                  aria-hidden="true"
                >
                  {activePin.content.title}
                </h2>
                <p
                  className={cn("text-xl", initialAnimationClasses)}
                  aria-hidden="true"
                >
                  {activePin.content.description}
                </p>

                <Link
                  href={activePin.content.cta.href}
                  aria-hidden="true"
                  className={cn(
                    "inline-block text-sm underline",
                    initialAnimationClasses
                  )}
                >
                  {activePin.content.cta.label}
                </Link>
                {activePin.content.youtubeVideoId ? (
                  <div
                    aria-hidden="true"
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
                ) : null}
              </div>
            )}
          </div>
        </div>

        {showOverlay ? (
          <BaseOverlay
            onClick={() => setActiveStep("SCRAMBLE")}
            containerRef={containerRef}
          />
        ) : null}

        {activeStep === "SCRAMBLE" ? (
          <ScrambleOverlay containerRef={containerRef} />
        ) : null}

        <div
          className={cn(
            "sticky bottom-15.5 flex justify-center",
            "opacity-0" // initial animation class
          )}
          ref={progressIndicatorRef}
        >
          <ProgressIndicator activeStep={activeStep} />
        </div>
      </div>
    </>
  );
}

function BaseOverlay({
  onClick,
  containerRef,
}: {
  onClick: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <Overlay containerRef={containerRef}>
      <div className="grid size-full grid-cols-2 gap-16">
        <div className="relative size-full">
          <Image
            src={rafJetImage}
            alt="Mission Control"
            className="size-full object-cover"
            fill
          />
        </div>
        <div className="flex max-w-xl flex-col justify-center space-y-6">
          <h2 className="text-5xl font-bold" data-animate>
            RAF High Wycombe
          </h2>
          <ul className="space-y-4 text-2xl">
            <li data-animate>
              <span className="font-semibold">NASOC Controller:</span> Lorem
              ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod
              tempor.
            </li>
            <li data-animate>
              <span className="font-semibold">CRC Controller:</span> Ut enim ad
              minim veniam quis nostrud exercitation ullamco laboris nisi.
            </li>
            <li data-animate>
              <span className="font-semibold">NASOC Controller:</span> Duis aute
              irure dolor in reprehenderit voluptate velit esse cillum dolore.
            </li>
            <li data-animate>
              <span className="font-semibold">CRC Controller:</span> Excepteur
              sint occaecat cupidatat non proident sunt in culpa qui officia.
            </li>
          </ul>
          <Button className="mt-10" data-animate onClick={onClick}>
            Scramble Jets
          </Button>
        </div>
      </div>
    </Overlay>
  );
}

function ScrambleOverlay({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Ideally the video here would be streamed in from a CDN or video service to save bandwidth.
  // For the demo it is statically hosted for speed of development.
  return (
    <Overlay containerRef={containerRef}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover"
      >
        <source src="/raf-video.mp4" type="video/mp4" />
      </video>
      <div className="isolate mx-auto flex h-dvh items-end px-19.5 pb-[188px]">
        <div
          className="bg-foreground/50 max-w-[445px] space-y-4 p-7.5 backdrop-blur"
          data-animate
        >
          <div className="flex items-start justify-between gap-6.25">
            <h2 className="text-3xl font-bold" data-animate>
              RAF Lossiemouth
              <br />
              Scramble
            </h2>
            <Image
              src={lossiemouthInsigniaImage}
              alt="RAF Lossiemouth Insignia"
              className="w-8.75"
              data-animate
            />
          </div>
          <p className="text-lg" data-animate>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi unde
            saepe, assumenda totam excepturi, odio aut harum corrupti cumque at
            voluptate illo accusantium velit nobis error atque eum nemo quidem.
          </p>
        </div>
      </div>
    </Overlay>
  );
}

type ContentSectionProps = {
  title: string;
  description: string;
  image?: StaticImageData;
  imageAlt?: string;
  cta: string;
  onClick: () => void;
};

function ContentSection({
  title,
  description,
  image,
  imageAlt,
  cta,
  onClick,
}: ContentSectionProps) {
  return (
    <>
      {/* Typically I would not use an next/image for this type of thing but an SVG.
           Also I would rarely use the next.js public directory because there is usually a cheaper way
           to store and process (hence the unoptimized prop) images e.g. through a DAM */}
      {image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          className={cn("size-[64px]", initialAnimationClasses)}
          unoptimized
        />
      )}
      {/* Decided not to go with the design system typography for this demo. 
              I have increased from the designs 33px to 48px to create better hierarchy. */}
      <h2 className={cn("text-5xl font-bold", initialAnimationClasses)}>
        {title}
      </h2>
      <p className={cn("text-3xl", initialAnimationClasses)}>{description}</p>
      <Button className={cn("mt-8", initialAnimationClasses)} onClick={onClick}>
        {cta}
      </Button>
    </>
  );
}

function Pin({
  pin,
  onClick,
  disabled,
}: {
  pin: PinData;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      key={pin.id}
      className={cn(
        "group bg-accent absolute size-4 cursor-pointer rounded-full",
        "disabled:cursor-default",
        "scale-200 opacity-0" // initial animation class
      )}
      data-pin
      aria-label={pin.name}
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="sr-only">{pin.name}</span>
      <div
        aria-hidden="true"
        className="bg-accent/60 absolute inset-0 animate-ping rounded-full group-disabled:hidden"
      />
    </button>
  );
}
