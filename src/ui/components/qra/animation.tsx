import { usePrefersReducedMotion } from "@/lib/hooks";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { PinData } from "./data";

gsap.registerPlugin(useGSAP);

function animateBlurTransition(
  element: gsap.TweenTarget,
  direction: "in" | "out" = "in",
  options: gsap.TweenVars = {}
) {
  const tl = gsap.timeline();
  const isIn = direction === "in";

  tl.to(element, {
    opacity: isIn ? 1 : 0,
    filter: isIn ? "blur(0px)" : "blur(4px)",
    scale: isIn ? 1 : 1.1,
    stagger: 0.1,
    duration: isIn ? 0.6 : 0.3,
    ease: "power2.in",
    ...options,
  });

  return tl;
}

export function useAnimatePathTransition({
  pathRef,
  mapContainerRef,
  contentRef,
  secondaryContentRef,
  pinData,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  secondaryContentRef: React.RefObject<HTMLDivElement | null>;
  pinData: PinData[];
}) {
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    const path = pathRef.current;
    const container = mapContainerRef.current;

    if (!path || !container) return;

    tl.current = gsap.timeline({ paused: true });

    const svg = path.parentElement;

    // Get SVG dimensions
    const { width, height } = container.getBoundingClientRect();

    // This is arbitrary. In practice it would be a more dynamic pin selection
    // This is only for demonstration purposes.
    const [pin1, pin2] = pinData;

    // Convert percentages to actual coordinates
    const offset = 6; // Offset to account for the pin size
    const x1 = (pin1.x / 100) * width + offset;
    const y1 = (pin1.y / 100) * height + offset;
    const x2 = (pin2.x / 100) * width + offset;
    const y2 = (pin2.y / 100) * height + offset;

    // Calculate control point for curve (midpoint with offset)
    const controlX = (x1 + x2) / 2;
    const controlY = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.2; // Curve upward

    // Update path
    path.setAttribute(
      "d",
      `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`
    );

    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    tl.current
      .set(svg, {
        opacity: 1,
      })
      .to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
      })
      .add(
        animateBlurTransition(contentRef.current?.children || [], "out"),
        "<"
      )
      .add(
        animateBlurTransition(
          secondaryContentRef.current?.children || [],
          "in"
        ),
        "<+0.3"
      )
      .call(() => {
        if (contentRef.current) contentRef.current.inert = true;
        if (secondaryContentRef.current)
          secondaryContentRef.current.inert = false;
      });
  }, []);

  return tl;
}

export function useLoadAnimation({
  containerRef,
  contentRef,
  progressIndicatorRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  progressIndicatorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tl = useRef<GSAPTimeline>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const map = gsap.utils.toArray("[data-map]");
      const pins = gsap.utils.toArray("[data-pin]");
      // Scope the data-animate selector to only the progress indicator
      const steps = gsap.utils.selector(progressIndicatorRef.current || "")(
        "[data-animate]"
      );

      if (prefersReducedMotion) {
        // Instantly show all content without animation
        gsap.set([map, contentRef.current?.children], {
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

      // Set initial position of the steps to animate from
      gsap.set(steps, { y: 10, opacity: 0 });

      tl.current
        .to(map, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
        })
        .to(
          map,
          {
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.15))",
            duration: 0.6,
          },
          "<+0.5"
        )
        .add(
          animateBlurTransition(contentRef.current?.children || [], "in"),
          "<+0.3"
        )
        .to(pins, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
        })
        .to(
          progressIndicatorRef.current,
          {
            opacity: 1,
            duration: 1,
          },
          "<+0.3"
        )
        .to(
          steps,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
          },
          "<"
        );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return tl;
}

export function useZoomAnimation({
  mapContainerRef,
  contentRef,
  pinContentRef,
  activePin,
  containerRef,
  progressIndicatorRef,
}: {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  pinContentRef: React.RefObject<HTMLDivElement | null>;
  activePin: PinData | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  progressIndicatorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tl = useRef<GSAPTimeline | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
    });
  }, []);

  useGSAP(
    () => {
      if (!tl.current || !mapContainerRef.current || !activePin) return;

      const scale = 8;
      const pins = gsap.utils.toArray("[data-pin]");

      gsap.set(mapContainerRef.current, {
        transformOrigin: `${activePin?.x}% ${activePin?.y}%`,
      });
      tl.current.clear();
      tl.current
        .to(mapContainerRef.current, {
          scale: scale,
          x: `${50 - activePin.x}%`,
          y: `${50 - activePin.y}%`,
          duration: 1.2,
        })
        .to(
          pins,
          {
            scale: 1 / scale,
            duration: 1.2,
          },
          "<"
        )
        .to(
          progressIndicatorRef.current,
          {
            y: 100,
            opacity: 0,
            duration: 0.6,
          },
          "<"
        )
        .add(
          animateBlurTransition(contentRef.current?.children || [], "out"),
          "<"
        )
        .call(() => {
          const isReversed = tl.current?.reversed();
          if (contentRef.current)
            contentRef.current.inert = isReversed ? false : true;
          if (pinContentRef.current)
            pinContentRef.current.inert = isReversed ? true : false;
        })
        .add(
          animateBlurTransition(pinContentRef.current?.children || [], "in"),
          ">-0.1"
        );
    },
    { scope: containerRef, dependencies: [activePin] }
  );

  return tl;
}

export function useOverlayAnimation({
  overlayRef,
}: {
  overlayRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tl = useRef<GSAPTimeline | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power2.inOut",
      },
    });
    const parent = overlayRef.current;

    if (!parent) return;

    const overlay = gsap.utils.selector(parent || "")("[data-animate-overlay]");
    const shutter = gsap.utils.selector(parent || "")("[data-animate-shutter]");
    const contentItems = gsap.utils.selector(parent || "")("[data-animate]");

    tl.current
      .set(contentItems, {
        opacity: 0,
        y: 10,
      })
      .to(shutter, {
        y: 0,
        duration: 0.6,
        ease: "power2.in",
      })
      .set(overlay, {
        opacity: 1,
      })
      .to(
        shutter,
        {
          y: "-100%",
          duration: 0.3,
        },
        ">+0.3"
      )
      .to(
        contentItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.075,
        },
        ">-0.1"
      );
  }, []);

  return tl;
}
