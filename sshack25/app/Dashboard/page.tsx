"use client";
import React, { useEffect, useRef, useState } from "react";
import { main } from "@/Gemini/llm";
import { dashbordTips } from "@/Gemini/prompts";
import { jsonrepair } from "jsonrepair";
import { Check, Play } from "lucide-react";
import { Confetti } from "@/components/magicui/confetti";

import { Button } from "@/components/ui/button";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { translations } from "../Uitils/LangData";
import { useLanguage } from "../Components/useLanguage";

//Add selection area ti select prefered language 

type QuizItem = {
  question: string;
  choices: string[];
  answer?: string;
  correctAnswer?: string;
  explanation?: string;
};

type Recommendation = {
  title: string;
  // Add other fields as needed
};


export default function Page() {
  const [summary, setSummary] = useState("Sawbona Sbu Ujnani");
  const [tip, setTip] = useState("");
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
const [resources, setResources] = useState<Recommendation[]>([]);
  const [rawResponse, setRawResponse] = useState("");
  const areaRef = useRef<HTMLDivElement | null>(null);
 
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const possibleInterests = [
  "Social Media",
  "Online Shopping",
  "Banking",
  "Gaming",
  "Streaming",
  "Email",
  "Work/Remote Work",
  "Travel",
  "Education",
  "Health",
  "News",
  "Cryptocurrency",
];
console.log(rawResponse)

const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
const { language } = useLanguage();
console.log("Current language:", language);
const [intrestsSelected, setInterestsSelected] = useState(false);
const [,setLoading] = useState<boolean>(true);
  // Play summary using SpeechSynthesis API

  const handlePlayClick = () => {
    if (!summary) return;
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new window.SpeechSynthesisUtterance(summary);
    utterance.lang = "zu-ZA"; // Set to isiZulu if supported, or use "en-US"
    window.speechSynthesis.speak(utterance);
  };
  

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY;
    if (!key) {
      console.error("API key is missing");
      return;
    }
   main({
  key: key,
  prompt: dashbordTips.prompt,
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `interests: ${selectedInterests.join(", ")}, preferred language: ${language}`,
        },
      ],
    },
  ],
})
      .then((response) => {
        setRawResponse(response);
        response ?setLoading(false):setLoading(true); 
        console.log("Raw response:", response);
        try {
          let cleaned = response.replace(/^[\s\S]*?({)/, "$1");
          cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
          const repaired = jsonrepair(cleaned);
          const parsed = JSON.parse(repaired);
          setSummary(parsed.cyberTip?.summary || "");
          setTip(parsed.cyberTip?.tip || "");
          setQuiz(parsed.quiz || []);
          setResources(parsed.recommendations || []);
        } catch (e) {
          console.error("Failed to parse response:", e);
        }
      })
      .catch((error) => {
        console.error("Error in LLM:", error);
      });
  }, []);
  useEffect(() => {
    console.log("Updated summary:", summary);
    console.log("Updated quiz:", quiz);
  }, [quiz, resources]);

  return (
    <main className="flex flex-col min-h-screen w-full bg-neutral-950 font-poppins text-[#ececec]">
      {/* 1. Show interests selection first */}
      {!intrestsSelected ? (
        <div className="mb-8 space-y-4 bg-neutral-900/50 rounded-2xl p-6 max-w-3xl mx-auto flex flex-col items-center justify-center h-1/2 my-20">
          <div>
            <h2 className="text-xl font-bold mb-2">
              <span>{translations["Select your interests:"][language as keyof typeof translations["Select your interests:"]]}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {possibleInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                className={
                  "px-4 py-2 rounded-md border " +
                  (selectedInterests.includes(interest)
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-600/50")
                }
                disabled={
                  !selectedInterests.includes(interest) && selectedInterests.length >= 3
                }
                onClick={() => {
                  setSelectedInterests((prev) =>
                    prev.includes(interest)
                      ? prev.filter((i) => i !== interest)
                      : [...prev, interest]
                  );
                }}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="place-self-end">
            <Button
              onClick={() => setInterestsSelected(true)}
              disabled={selectedInterests.length === 0}
            >
              Continue to dashboard
            </Button>
          </div>
        </div>
      ) : 
      // 2. Show loading animation while waiting for LLM response
      (
        (!summary || !tip || quiz.length === 0 || resources.length === 0) ? (
          <div className="mx-auto my-auto space-y-4 flex flex-col items-center justify-center h-1/2">
            <DotLottieReact
              src="https://lottie.host/3da99501-3d67-4c45-8e32-9253f640b9e0/lez9j5bm1E.lottie"
              loop
              autoplay
            />
            <h2 className="text-lg font-semibold text-center">
              Building your personalized dashboard...
            </h2>
          </div>
        ) : (
          // 3. Show dashboard sections when data is ready
          <>
            <section className="flex flex-col items-center justify-center py-10 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full max-w-5xl p-6 rounded-4xl bg-neutral-800/50">
                <div className="flex-1 p-4 text-2xl break-words">
                  <h1>{tip || "Welcome! Your summary will appear here."}</h1>
                </div>
                <div
                  ref={areaRef}
                  className="bg-neutral-400 w-52 h-52 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={handlePlayClick}
                  title="Read summary aloud"
                >
                  <Play size={64} />
                </div>
              </div>
            </section>

            <section className="flex flex-col min-h-screen h-fit items-center justify-center py-10 w-full">
              <div className="w-full max-w-3xl">
                <div className="flex flex-col flex-1 max-w-screen-sm justify-center space-y-4">
                  <h2>Quiz</h2>
                  <div className="w-full border-t-2 h-2 border-neutral-200"></div>
                  {quiz.length > 0 ? (
                    currentQuestion === quiz.length - 1 && showAnswer ? (
                      <div className="flex flex-col items-center justify-center gap-4 p-6  rounded-lg mt-4">
                        <Confetti />
                        <h2 className="text-2xl font-bold ">Level 1 :Cyber Novice</h2>
                        <span className="text-lime-400 font-bold text-xl">
                          🎉 Congratulations! You completed the quiz! 🎉
                        </span>
                      </div>
                    ) : (
                      <div className="mb-4 p-4 rounded bg-neutral-900">
                        <p className="font-bold">{quiz[currentQuestion].question}</p>
                        <div className="flex flex-col space-y-2 mt-2">
                          {(quiz[currentQuestion].choices || []).map((option: string, i: number) => (
                            <button
                              onClick={() => {
                                setSelectedAnswer(option);
                                setShowAnswer(true);
                              }}
                              key={i}
                              disabled={showAnswer}
                              className={
                                "flex items-center space-x-2 p-2 border rounded hover:bg-neutral-800 " +
                                (showAnswer
                                  ? option ===
                                    (quiz[currentQuestion].answer ||
                                      quiz[currentQuestion].correctAnswer)
                                    ? "border-neutral-800/50 bg-lime-900/30"
                                    : option === selectedAnswer
                                    ? "border-red-400 bg-red-900/30"
                                    : "border-neutral-600"
                                  : "border-neutral-800/50")
                              }
                            >
                              <Check className="text-lime-400" />
                              <span>{option}</span>
                            </button>
                          ))}
                        </div>
                        {showAnswer && (
                          <div className="mt-2 text-sm">
                            {selectedAnswer ===
                            (quiz[currentQuestion].answer ||
                              quiz[currentQuestion].correctAnswer) ? (
                              <span className="text-lime-400 font-bold">
                                Correct!
                              </span>
                            ) : (
                              <span className="text-red-400 font-bold">
                                Incorrect.
                              </span>
                            )}
                            {quiz[currentQuestion].explanation && (
                              <div className="mt-1 text-neutral-300">
                                {quiz[currentQuestion].explanation}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="mt-4">
                          {currentQuestion < quiz.length - 1 && (
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => {
                                setCurrentQuestion(currentQuestion + 1);
                                setSelectedAnswer(null);
                                setShowAnswer(false);
                              }}
                              disabled={!showAnswer}
                            >
                              Next question
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <p>No quiz available at the moment.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="flex min-h-screen flex-col  py-10 w-full">
              <div className="w-full max-w-3xl">
                <h2 className="text-4xl font-bold mb-2">Recommendations</h2>
                <div className="grid grid-cols-3 gap-6 w-full min-w-7xl ">
                  {resources.length > 0 ? (
                    resources.map((resource, idx) => (
  <div key={`${resource.title}-${idx}`}>{resource.title}</div>
))
                  ) : (
                    <p>No recommendations yet.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )
      )}
    </main>
  );
}
