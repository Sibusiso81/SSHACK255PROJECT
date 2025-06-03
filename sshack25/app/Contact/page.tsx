import { Check } from "lucide-react";
import React from "react";

function page() {
  return (
    <section className="w-screen h-screen text-white p-6 bg-neutral-950
      overflow-x-hidden flex flex-col   ">
      <div className="place-self-end  ">
        <h2>Level 1 :Cyber Novice</h2>
      </div>
      <div className="flex flex-col flex-1 max-w-screen-sm justify-center space-y-4">
        <h2>Quiz</h2>
        <div className="w-full border-t-2 h-2 border-neutral-200"></div>
        <p>Question</p>
        <div className="gap-2">
          <button className="flex space-x-2 p-1.5 border-2 border-lime-400 w-lg">
            <Check className="p-1 bg-neutral-900/75 border-2 border-neutral-600 rounded-2xl stroke-lime-400"/><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
          </button>
          <button className="flex space-x-2 p-1.5 border-2 border-red-400 w-lg">
            <Check className="p-1 rounded-2xl stroke-red-400"/><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
          </button>
          
          <button className="flex space-x-2">
            <Check/><p>Answer</p>
          </button>
        </div>
      </div>
      <div className=""></div>
    </section>
  );
}

export default page;
