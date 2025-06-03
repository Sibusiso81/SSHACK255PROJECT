import { LucideIconName } from "@/app/Components/DynamicLucideIcon"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface LandingPageProps{
  index:number,
  onLanguageChange:(lang:string)=>void,
}
export interface FeatureCardProps{
  icon:LucideIconName,
  heading:string,
  description:string
}

export interface PricingCardProps{
 
  price:string,
  description:string,
  features:string[],
  idx:number,
  buttonText:string,
}

export interface HowToProps{
  steps:{ step: string; subHeading: string; description: string; }[]
} 

export interface TeamProfileCard{
   inview:string,
  name:string,
  role:string,
  description:string,
  image:string,
}
export interface TipsProps {
  key: string;
  prompt: { text: string }[];
  contents: {
    role: string;
    parts: { text: string }[];
  }[];
}