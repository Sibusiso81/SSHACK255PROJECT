'use client'
import React from "react";
import { motion } from "framer-motion";

interface NevMenuToggleProps {
    menuOpen: boolean;
    setMenuOpen: (_: boolean) => void;
}

const path1Variants = {
    closed: { d: "M3 7H21" }, // Top line of hamburger
    open: { d: "M4 4L20 20" }, // Top-left to bottom-right (cross)
};

const path2Variants = {
    closed: { d: "M3 17H21" }, // Bottom line of hamburger
    open: { d: "M20 4L4 20" }, // Top-right to bottom-left (cross)
};

const Navbutton: React.FC<NevMenuToggleProps> = ({ menuOpen, setMenuOpen }) => {
    return (
        <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex flex-col justify-center items-center cursor-pointer z-50"
            style={{ width: 32, height: 32 }}
        >
            <svg width={24} height={24} viewBox="0 0 24 24">
                <motion.path
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    variants={path1Variants}
                    animate={menuOpen ? "open" : "closed"}
                />
                <motion.path
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    variants={path2Variants}
                    animate={menuOpen ? "open" : "closed"}
                />
            </svg>
        </div>
    );
};

export default Navbutton;