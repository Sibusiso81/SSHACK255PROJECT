import { PricingCardProps } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

function PricingCard({price,description,features,idx,buttonText}:PricingCardProps) {
    const plans = ['Free','Basic','Pro']
    
  return (
   <div className={`  flex flex-col p-6   md:p-7 lg:p-5 rounded-lg shadow-sm border  space-y-6 ${idx === 0 ? ' border-neutral-300' : idx === 1 ? 'bg-neutral-950 text-white ' : ' border-neutral-100'}`}>
    <div className='flex flex-col space-y-4 '>
      <div className='space-y-3 text-lg font-semibold'>  <h1>{plans[idx]}</h1>
        <p className={` ${idx === 0 ?' text-muted-foreground': idx===1? 'text-white/95 ':' text-muted-foreground' }`}>{description}</p></div>
       <div className='flex space-x-2 items-center'>
        <h2 className='text-2xl  font-medium '>{price}</h2>
        <p className={` text-md ${idx === 0 ?' text-muted-foreground': idx===1? 'text-white/50 ':' text-muted-foreground' }`}>{price != typeof('') ? '/pm' :''}</p>
       </div>
    </div>
<div className='w-full h-0.5 bg-neutral-300/30'></div>
{
    features&&(
        features.map((items)=>(
            <ul className='flex space-x-4 text-sm' key={items}>
                <Check className={`stroke-gray-400 ${idx === 0 ?' ': idx===1? 'bg-white  ':' text-white' } bg-gray-200/45 rounded-full w-4 h-4 `}/><li>{items}</li>
            </ul>
        ))
    )
}

<button className={`w-full p-3 text-center bg-neutral-950 text-white rounded-lg ${idx === 0 ? 'hover:bg-neutral-800' : idx === 1 ? 'hover:bg-neutral-700 bg-white text-black'  : 'hover:bg-neutral-600'} transition-colors duration-300`}>
<p className={`${idx === 0 ?' text-white': idx===1? 'text-black ':' text-white' }`}>{buttonText}</p>
</button>
   </div>
  )
}

export default PricingCard