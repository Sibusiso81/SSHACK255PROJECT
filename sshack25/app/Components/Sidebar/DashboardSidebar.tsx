"use client";
import { ActivitySquare, GlobeLock, KeyRound, MessageSquareCode, Paperclip,  Router,  } from "lucide-react";
import React, {  useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Sidebarlinks from "./Sidebarlinks";
const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transotion: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};
const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};
function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();
  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
    }
  }, [isOpen, containerControls, svgControls]);
  function handleNavControls() {
    setIsOpen(!isOpen);
    console.log(`${isOpen?'menu opened':'menu closed'}`)
    console.log('menu clicked')
  }
  return (
    <motion.nav
      variants={containerVariants}
      animate={containerControls}
      initial="close"
      className="bg-neutral-900
    flex flex-col  z-50 gap-20 p-5 absolute top-0 left-0 h-full shadoow "
    >
      <div className="flex flex-row justify-between place-items-center ">
        <div className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-lime-400 rounded-full" />
        <button className="p-1 rounded-full " onClick={handleNavControls}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
            className={`w-8 h-8 stroke-neutral-200`}
          >
            <motion.path
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              variants={svgVariants}
              animate={svgControls}
              d={"M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                
              }}
            ></motion.path>
          </svg>
        </button>
      </div>

      {/* 
       const paths =[
        'AI-CyberSecurity Aassistant',
        'Device&Netowrk Security',
        'Emails&Attachment Scanner',
        'Overview',
        'PasswordGen&BreachChecker',
        'URL&WebsiteSecurity'

    ]
      
      */}
     <div className="flex flex-col gap-3 gap-y-10">
  <Sidebarlinks isOpen={isOpen} name="Overview" path="/Dashboard/overview">
    <ActivitySquare className="stroke-white stroke-[0.75] minw-8 w-8 "/>
  </Sidebarlinks>
  <Sidebarlinks isOpen={isOpen} name="Passwords" path="/Dashboard/password-gen-breach-checker">
    <KeyRound className="stroke-white stroke-[0.75] minw-8 w-8 "/>
  </Sidebarlinks>
  <Sidebarlinks isOpen={isOpen} name="Emails & Attachments" path="/Dashboard/emails-attachment-scanner">
    <Paperclip className="stroke-white stroke-[0.75] minw-8 w-8 "/>
  </Sidebarlinks>
  <Sidebarlinks isOpen={isOpen} name="AI-Assistant" path="/Dashboard/ai-assistant">
    <MessageSquareCode className="stroke-white stroke-[0.75] minw-8 w-8 "/>
  </Sidebarlinks>
  <Sidebarlinks isOpen={isOpen} name="URL Security" path="/Dashboard/url-website-security">
    <GlobeLock className="stroke-white stroke-[0.75] minw-8 w-8 "/>
  </Sidebarlinks>
  <Sidebarlinks isOpen={isOpen} name="Devices & Networks" path="/Dashboard/device-network-security">
    <Router className="stroke-white stroke-[0.75] minw-8 w-8 "/>
  </Sidebarlinks>
</div>
    
    </motion.nav>
  );
}

export default DashboardSidebar;
