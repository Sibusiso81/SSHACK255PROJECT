"use client";
import { useLanguage } from "@/app/Components/useLanguage";
import { sampleInputsTranslations } from "@/app/Uitils/LangData";
import { main } from "@/Gemini/llm";
import { aiAssistant } from "@/Gemini/prompts";
import { AnimatePresence, motion } from "framer-motion";
import { jsonrepair } from "jsonrepair";
import { ArrowUp, CircleUserRound, Paperclip, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Resource = { url: string; title: string; description: string };
type AIMessage = {
  role: "user" | "ai";
  content: string | { explanation: string; resources: Resource[] };
};

function Page() {
  const [aiResponse, setAiResponse] = useState("");
  const [answer, setAnswer] = useState("");
  const [resources, setResources] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [sampleInputIndex, setSampleInputIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const { language } = useLanguage();
  console.log(
    aiResponse,
    answer,
    resources,
    userInput,
    sampleInputIndex,
    file,
    messages,
    language
  );
  const sampleInputs = (
    Object.keys(sampleInputsTranslations) as Array<
      keyof typeof sampleInputsTranslations
    >
  ).map(
    (key) =>
      sampleInputsTranslations[key][
        language as keyof (typeof sampleInputsTranslations)[typeof key]
      ] || sampleInputsTranslations[key].English
  );
  useEffect(() => {
    if (userInput.length > 0) return;
    const interval = setInterval(() => {
      setSampleInputIndex((prev) => (prev + 1) % sampleInputs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [userInput, sampleInputs.length]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY;
    if (!key) {
      console.error("API key is missing");
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    // Construct the JSON object
    const userPayload = {
      preferred_language: language,
      user_question: userInput,
    };

    const contents: {
      role: string;
      parts: { text: string }[];
    }[] = [
      {
        role: "user",
        parts: [
          {
            text: JSON.stringify(userPayload, null, 2),
          },
        ],
      },
    ];

    // File upload is not supported by the current API type, so we skip file handling here.

    main({
      key,
      prompt: aiAssistant.prompt,
      contents,
    })
      .then((response) => {
        setAiResponse(response);
        try {
          let cleaned = response.replace(/^[\s\S]*?({)/, "$1");
          cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
          const repaired = jsonrepair(cleaned);
          const parsed = JSON.parse(repaired);

          // Save explanation and resources for rendering
          setAnswer(parsed.explanation || "");
          setResources(parsed.resources || []);

          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: {
                explanation: parsed.explanation || "",
                resources: parsed.resources || [],
              },
            },
          ]);
        } catch (e) {
          // fallback
          setMessages((prev) => [...prev, { role: "ai", content: response }]);
        }
      })
      .catch((error) => {
        console.error("Error in Ai Assistant:", error);
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Sorry, something went wrong." },
        ]);
      });

    // Clear both input fields after submit
    setUserInput("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Paperclip click
  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
    setUserInput("");
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFile(null);
    }
  };

  return (
    <section className=" w-screen h-screen max-h-screen flex flex-col justify-center items-center mx-auto p-6 max-w-screen-md ">
      <div className="flex-1 w-full mb-4 overflow-y-scroll scrollbar-hide space-y-4">
        {messages.map((msg, idx) => (
          <div
            className={`flex items-end space-y-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
            key={idx}
          >
            {msg.role !== "user" && (
              <User className="w-6 h-6 stroke-[#ececec] self-end mr-2" />
            )}
            <div
              className={`my-2 p-2 rounded ${
                msg.role === "user"
                  ? "bg-white text-black ml-auto w-fit"
                  : "bg-transparent text-white mr-auto w-fit prose "
              }`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {msg.role === "ai" &&
              typeof msg.content === "object" &&
              msg.content !== null &&
              "explanation" in msg.content &&
              "resources" in msg.content ? (
                <>
                  <div className="mb-4">{msg.content.explanation}</div>
                  {Array.isArray(msg.content.resources) &&
                    msg.content.resources.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {msg.content.resources.map((res: any, i: number) => (
                          <div key={i} className=" flex flex-col items-start">
                            <div className="bg-neutral-900 rounded-lg p-3 flex flex-col space-y-2 text-xs">
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-lime-400 hover:underline"
                              >
                                {res.title}
                              </a>
                              <p className="text-sm text-neutral-300 mt-1">
                                {res.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </>
              ) : // fallback for plain string content
              typeof msg.content === "string" ||
                React.isValidElement(msg.content) ? (
                msg.content
              ) : null}
            </div>
            {msg.role === "user" && (
              <CircleUserRound className="w-6 h-6 stroke-[#ececec] self-end ml-2" />
            )}
          </div>
        ))}
      </div>
      <div className="relative bg-neutral-800 rounded-xl w-full p-3">
        <div
          className="[&[data-feedback=true]]:opacity-0"
          data-feedback={userInput ? "true" : "false"}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              aria-hidden
              className="absolute left-3 top-3 w-full text-muted-foreground"
              key={sampleInputIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0 }}
            >
              {sampleInputs[sampleInputIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={3}
            className="w-full resize-none outline-none [&::placeholder]:opacity-0 bg-transparent"
            autoFocus
            placeholder="Enter query"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="flex space-x-2 float-end">
            <button
              className="float-end p-2 bg-white rounded-full text-black [&:disabled]:bg-muted-foreground/30 [&:disabled]:text-foreground/30"
              disabled={userInput.length === 0 && !file}
              type="submit"
              title="Send"
            >
              <ArrowUp />
            </button>
            <button
              className="float-end p-2 bg-white rounded-full text-black"
              type="button"
              onClick={handlePaperclipClick}
              title="Attach file"
            >
              <Paperclip />
            </button>
          </div>
          {file && (
            <div className="text-xs text-muted-foreground mt-2">
              Attached: {file.name}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Page;
