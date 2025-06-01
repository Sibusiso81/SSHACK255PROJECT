import React from 'react'
interface Props{
    children:React.ReactNode,
    name:string,
    isOpen:boolean,
    path:string
}
function Sidebarlinks({children,name,isOpen,path}:Props) {
   
    
  return (
<a href={`Dashboard/${path}`} className=' overflow-hidden flex  rounded-lg stroke-[0.75]   cursor-pointer hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 gap-y-14  transition-colors duration-100'>
        <p className={`${isOpen ?'block opacity-100':'hidden opacity-0'}text-inherit font-poppins overflow-clip whitespace-nowrap tracking-wide`}>{name}</p>
    {children}

   </a>
  )
}

export default Sidebarlinks