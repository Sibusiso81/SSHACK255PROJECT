'use client'

import LandingPage from "./Components/Hero/LandingPage";

export default function Home() {
   /*  const [langSelected, setLangSelected] = useState(String);
    const [selected, setSelected] = useState(false);
    const [index, setIndex] = useState<number>(0); */
    
   /*  function handleSelectedLanguage(i: number) {
        setLangSelected(langData[i].language);
        setSelected(true);
    
        setIndex(langData.indexOf(langData[i]));
      } */
      
  return (
    <main className="overflow-hidden">
        <LandingPage/>
    </main>
  );
}
