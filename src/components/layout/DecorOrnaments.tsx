"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type Ornament = {
  src: string;
  alt: string;
  className: string;
  duration: number;
  y?: number[];
  x?: number[];
  rotate?: number[];
  opacity?: number;
  scale?: number;
  blur?: boolean;
};

const globalOrnaments: Ornament[] = [
  // Top Left - Tea leaf
  {
    src: "/assets/decor/tea-leaf-no-bg.png",
    alt: "Tea leaf",
    className: "left-[5%] top-[15vh] w-16 md:w-24",
    duration: 6,
    y: [0, -20, 0],
    rotate: [0, 15, 0],
    opacity: 0.9,
    scale: 1,
  },
  // Top right - Ice cube
  {
    src: "/assets/decor/ice-cube-no-bg.png",
    alt: "Ice cubes",
    className: "right-[8%] top-[25vh] w-12 md:w-20",
    duration: 5,
    y: [0, 15, 0],
    rotate: [0, -10, 0],
    opacity: 0.7,
    scale: 0.8,
  },
  // Middle left - Blurred Ice
  {
    src: "/assets/decor/ice-cube-no-bg.png",
    alt: "Ice cubes blurred",
    className: "left-[-2%] top-[55vh] w-24 md:w-32",
    duration: 7,
    y: [0, -15, 0],
    rotate: [0, 20, 0],
    opacity: 0.4,
    scale: 1.2,
    blur: true,
  },
  // Bottom right - Tea leaf
  {
    src: "/assets/decor/tea-leaf-no-bg.png",
    alt: "Tea leaf",
    className: "right-[2%] top-[75vh] w-20 md:w-28",
    duration: 8,
    y: [0, -25, 0],
    rotate: [0, -15, 0],
    opacity: 0.85,
    scale: 0.9,
  },
  // Center Deep background - Large blurred leaf
  {
    src: "/assets/decor/tea-leaf-no-bg.png",
    alt: "Tea leaf blurred",
    className: "left-[60%] top-[40vh] w-48 md:w-64",
    duration: 10,
    y: [0, 30, 0],
    rotate: [0, 5, 0],
    opacity: 0.15,
    scale: 1.5,
    blur: true,
  },
];

type DecorOrnamentsProps = {
  mode?: "home" | "menu";
};

export default function DecorOrnaments({ mode = "home" }: DecorOrnamentsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div className="relative h-full w-full max-w-[100vw]">
        {globalOrnaments.map((item, index) => (
          <motion.div
            key={`global-decor-${index}`}
            className={`absolute ${item.className} ${item.blur ? 'blur-[8px] md:blur-[12px]' : 'drop-shadow-2xl'}`}
            animate={{
              y: item.y || [0, -8, 0],
              x: item.x || [0, 0, 0],
              rotate: item.rotate || [0, 0, 0],
            }}
            transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: item.opacity ?? 1, scale: item.scale ?? 1 }}
          >
            <Image src={item.src} alt={item.alt} width={300} height={300} className="h-auto w-full object-contain" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
