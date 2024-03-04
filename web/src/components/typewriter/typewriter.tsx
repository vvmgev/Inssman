"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const words = ["Faster.", "Easier.", "Efficient.", "Productive.", "Advanced.", "Collaborative.", "Smooth."];

export const TypewriterEffectSmooth = () => {
  const [index, setIndex] = useState<number>(0);
  const renderWord = () => {
    return words[index].split("").map((char, idx) => {
      return (
        <span
          className="relative z-20 text-xl text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-sky-600"
          key={`char-${idx}`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <motion.div
      key={index}
      onAnimationComplete={() => {
        setIndex((index) => {
          return index === words.length - 1 ? 0 : index + 1;
        });
      }}
      className="pb-2"
      initial={{
        width: "0%",
        overflow: "hidden",
      }}
      animate={{
        width: ["0%", "15%", "0%"],
        transition: {
          duration: 3,
          times: [0, 0.5, 1],
        },
      }}
    >
      <div
        className="text-sky-500"
        style={{
          whiteSpace: "nowrap",
        }}
      >
        <div className="inline-block">{renderWord()}</div>
      </div>
    </motion.div>
  );
};
