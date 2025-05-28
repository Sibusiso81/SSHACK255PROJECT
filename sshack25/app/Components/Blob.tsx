"use client";
import React from "react";
import { motion } from "framer-motion";
function Blob() {
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      x: [0, 40, -30, 0],
      y: [0, -30, 40, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, rgba(71,120,80,1) 0%, rgba(26,87,55,1) 18%, rgba(7,36,21,1) 64%, rgba(0,0,0,1) 100%)",
      }}
      className="absolute inset-0 -z-10 overflow-hidden opacity-15 blur-2xl"
    >
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#1A5737] rounded-full opacity-40 blur-3xl mix-blend-lighten top-[-100px] left-[-100px]"
        variants={blobVariants}
        animate="animate"
      />
      <motion.div
        className="absolute w-[500px] h-[500px] bg-[#477850] rounded-full opacity-40 blur-3xl mix-blend-lighten top-[30%] left-[30%]"
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 4 }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] bg-[#477850] rounded-full opacity-40 blur-3xl mix-blend-lighten bottom-[-100px] right-[-100px]"
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 8 }}
      />
    </div>
  );
}

export default Blob;
