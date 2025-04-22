"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variant } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimateInViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  variant?: "fade" | "slide-up" | "slide-right" | "slide-left" | "scale";
  threshold?: number; // 0 to 1
};

const variants = {
  hidden: {
    opacity: 0,
    y: 0,
    x: 0,
    scale: 1,
  },
  enter: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
  },
};

const getInitialState = (variant: string): Variant => {
  const hidden = { ...variants.hidden };

  switch (variant) {
    case "fade":
      hidden.opacity = 0;
      break;
    case "slide-up":
      hidden.opacity = 0;
      hidden.y = 30;
      break;
    case "slide-right":
      hidden.opacity = 0;
      hidden.x = -30;
      break;
    case "slide-left":
      hidden.opacity = 0;
      hidden.x = 30;
      break;
    case "scale":
      hidden.opacity = 0;
      hidden.scale = 0.9;
      break;
    default:
      break;
  }

  return hidden;
};

export function AnimateInView({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  variant = "fade",
  threshold = 0.1,
}: AnimateInViewProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          controls.start("enter");
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
          controls.start("hidden");
        }
      },
      {
        threshold,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls, once, threshold]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: getInitialState(variant),
        enter: {
          ...variants.enter,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1.0], // Easing function
          },
        },
      }}
      className={cn(className)}
      aria-hidden={!isInView}
    >
      {children}
    </motion.div>
  );
}
