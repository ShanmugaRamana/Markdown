"use client";

import { useEffect } from 'react'; // 1. Import useEffect
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

interface Clock8Props extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const clockHandVariants: Variants = {
  normal: {
    rotate: 0,
    originX: "50%",
    originY: "50%",
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

const Clock8 = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#FFA500",
  ...props
}: Clock8Props) => {
  const controls = useAnimation();


  return (
    <div
      style={{
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <motion.polyline
          points="12 6 12 12 8 14"
          variants={clockHandVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { Clock8 };