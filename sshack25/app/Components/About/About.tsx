'use client'
import { langData } from '@/app/Uitils/LangData'
import { LandingPageProps } from '@/lib/utils'
import React from 'react'

function About({index}:LandingPageProps) {
 if(langData[index]){
  console.log()
 }else{
  console.log(`invalid index : ${index}`)
 }
  
  return (
    <section className='w-screen h-screen flex flex-col p-2 md:p-4 lg:p-6' id='About'>
      <div className=""><h1>{langData[index].aboutSection.title}</h1>
      </div>
      <div className=""><h2>{langData[index].aboutSection.ourMission}</h2></div>
      <div className=""></div>
    </section>
  )
}

export default About