import React, { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { SPRING } from "./motionConfig";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = "",
  suffix = "",
  className,
}) => {
  // base motion value and transformed rounded value
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (latest) => Math.round(latest));

  // react state that mirrors the rounded motion value so component re-renders
  const [display, setDisplay] = useState<number>(Math.round(value));

  useEffect(() => {
    // subscribe to changes on the transformed motion value
    // rounded.onChange is provided by framer-motion motion values
    const unsubscribe = rounded.onChange((v: number) => {
      setDisplay(v);
    });

    // animate from current mv to new `value`
    const current = mv.get();
    const delta = Math.abs(value - current);

    // if huge jump, use a short ease-out for perception
    let controls: { stop: () => void } | null = null;
    if (delta > 1_000_000) {
      controls = animate(mv, value, { duration: 0.5, ease: "easeOut" });
    } else {
      controls = animate(mv, value, {
        type: "spring",
        stiffness: SPRING.medium.stiffness,
        damping: SPRING.medium.damping,
      });
    }

    return () => {
      // cleanup subscription and animation
      unsubscribe();
      if (controls && typeof controls.stop === "function") controls.stop();
    };
    // re-run effect whenever `value` changes
  }, [value]); // note: we intentionally don't add mv/rounded to deps; they are stable

  // render react state (guaranteed to update immediately when motion value changes)
  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
