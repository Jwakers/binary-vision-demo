import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";
import missionControlImage from "~/public/mission-control.jpg";
import { useOverlayAnimation } from "./animation";
import { Button } from "./button";

export function Overlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayTl = useOverlayAnimation({ overlayRef });

  useEffect(() => {
    if (!overlayTl.current) return;
    overlayTl.current.play();
  }, [overlayTl]);

  return (
    <div className="absolute inset-0" ref={overlayRef}>
      <div
        className={cn(
          "bg-map text-map-foreground grid size-full grid-cols-2 gap-16",
          "opacity-0" // initial animation class
        )}
        data-animate-overlay
        inert
      >
        <div className="relative size-full">
          <Image
            src={missionControlImage}
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
          <Button className="mt-10" data-animate>
            Scramble Jets
          </Button>
        </div>
      </div>
      <div
        aria-hidden
        data-animate-shutter
        className="bg-primary fixed bottom-0 size-full translate-y-full"
      />
    </div>
  );
}
