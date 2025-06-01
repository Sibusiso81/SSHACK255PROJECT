

import { ThemeProvider } from "@/components/ui/theme-provider";
import DashboardSidebar from "../Components/Sidebar/DashboardSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
 
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
       <main className='w-full h-screen flex flex-row relative bg-neutral-950 font-poppins text-white'>
      <DashboardSidebar/>
    <section className='flex flex-col p-10 ml-20  w-full gap-5 '>
       {children}
        

    </section>
   </main>
    
    </ThemeProvider>
  );
}
