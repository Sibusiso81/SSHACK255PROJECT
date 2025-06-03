
'use client'
import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import DashboardSidebar from "../Components/Sidebar/DashboardSidebar";
import { LanguageProvider } from "../Components/LanguageProvider";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
  <LanguageProvider>

       <main className='w-screen h-screen overflow-y-scroll overflow-x-hidden flex flex-row relative bg-neutral-950 font-poppins text-[#ececec] z-0'>
      <div className="fixed z-30 left-0 top-0 h-screen w-20 bg-neutral-900 bg-opacity-95 shadow-lg flex flex-col"><DashboardSidebar/></div>
    <section className='flex flex-col p-10 ml-20  w-full gap-5 z-0'>
      
        
 
    {children}
  
    </section>
   </main>
    </LanguageProvider>
    </ThemeProvider>
  );
}
