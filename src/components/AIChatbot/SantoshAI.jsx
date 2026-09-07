import { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiX,
  FiRefreshCw,
  FiMessageCircle,
} from "react-icons/fi";

import { getAIResponse } from "./chatbot/responseEngine";
import suggestedQuestionsData from "./chatbot/suggestedQuestions";

export default function SantoshAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi there! 👋 I'm Santosh AI. \nAsk me anything about Santosh's skills, projects, or experience!",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const openChat = () => {
    setIsOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: "Hi there! 👋 I'm Santosh AI. \nAsk me anything about Santosh's skills, projects, or experience!",
      },
    ]);

    setInput("");
  };

  const sendMessage = async (question = input) => {
    const userQuestion = String(question || "").trim();

    if (!userQuestion || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const result = await getAIResponse(
        userQuestion
      );

      let responseText = "";

      if (typeof result === "string") {
        responseText = result;
      } else if (
        result &&
        typeof result === "object"
      ) {
        responseText =
          result.response ||
          result.answer ||
          result.text ||
          result.message ||
          "";
      }

      if (!responseText) {
        responseText =
          "I couldn't find the exact information. Please try asking something else about Santosh.";
      }

      setTimeout(() => {
        setMessages((previous) => [
          ...previous,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: responseText,
          },
        ]);

        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error(
        "Santosh AI Error:",
        error
      );

      setTimeout(() => {
        setMessages((previous) => [
          ...previous,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "Oops! Something went wrong. Please try again.",
          },
        ]);

        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  /*
   * Suggested Questions
   *
   * suggestedQuestions.js now contains sections:
   * featured, about, skills, projects, experience,
   * education, certificates, resume, contact.
   *
   * For the main chatbot Suggested section,
   * we only display the featured questions.
   */
  const safeQuestions = Array.isArray(
    suggestedQuestionsData?.featured
  )
    ? suggestedQuestionsData.featured
        .filter(
          (question) =>
            typeof question === "string" &&
            question.trim()
        )
        .slice(0, 6)
    : [];

  const CuteRobot = ({ small = false }) => {
    if (small) {
      return (
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-[8px] bg-gradient-to-tr from-slate-100 via-white to-slate-200 shadow-sm border border-slate-300">
            <div className="absolute -top-1 w-1 h-1 rounded-full bg-slate-400"></div>

            <div className="flex h-3.5 w-4 items-center justify-center gap-1 rounded-[3px] bg-slate-900 shadow-inner">
              <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_3px_rgba(34,211,238,1)]" />
              <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_3px_rgba(34,211,238,1)]" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[50px] w-[55px] flex items-center justify-center select-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 rounded-full bg-gradient-to-r from-slate-200 to-white border border-slate-300"></div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 rounded-full bg-gradient-to-l from-slate-200 to-white border border-slate-300"></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-400 to-white shadow-[0_0_5px_rgba(34,211,238,0.7)] border border-slate-200"></div>

          <div className="w-0.5 h-1 bg-slate-300"></div>
        </div>

        <div className="relative z-20 w-[46px] h-[38px] mt-1 rounded-[14px] bg-gradient-to-tr from-slate-200 via-white to-slate-100 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.1)] border border-white flex items-center justify-center">
          <div className="absolute top-1 left-2.5 w-5 h-1 bg-white rounded-full blur-[0.5px]"></div>

          <div className="w-[36px] h-[26px] bg-slate-900 rounded-[10px] flex flex-col items-center justify-center shadow-inner border border-slate-700 relative overflow-hidden">
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,1)]"></div>

              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,1)]"></div>
            </div>

            <div className="w-3 h-1 border-b border-cyan-300 rounded-full mt-0.5"></div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-28 right-4 sm:right-6 z-[9998] flex items-center gap-3 pointer-events-auto group">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-lg backdrop-blur-md pointer-events-none">
          <p className="font-semibold text-blue-600 flex items-center gap-1">
            <span>Hi! Ask me anything</span>
            <span>🤖</span>
          </p>
        </div>

        <div className="relative">
          <span className="absolute right-0 top-0 z-30 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-ping" />

          <span className="absolute right-0 top-0 z-30 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />

          <button
            type="button"
            onClick={openChat}
            aria-label="Open Santosh AI Assistant"
            className="relative flex items-center justify-center p-1 bg-white/90 hover:bg-white rounded-full shadow-md border border-slate-200 transition-all duration-300 hover:scale-105 focus:outline-none cursor-pointer backdrop-blur-md"
          >
            <CuteRobot />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-28 right-4 sm:right-6 z-[9999] w-[calc(100vw-24px)] max-w-[350px] pointer-events-auto">
      <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <CuteRobot small />

            <div>
              <p className="text-xs font-bold tracking-wide text-slate-900 flex items-center gap-1">
                Santosh AI

                <span className="px-1.5 py-0.2 text-[8px] font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                  Pro
                </span>
              </p>

              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] text-slate-500 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetChat}
              title="Reset chat"
              className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <FiRefreshCw size={13} />
            </button>

            <button
              type="button"
              onClick={closeChat}
              title="Close"
              className="rounded-lg p-1 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <FiX size={15} />
            </button>
          </div>
        </div>

        <div className="h-[320px] overflow-y-auto px-3 py-3 space-y-3 bg-slate-50/50">
          {messages.map((message) => {
            const isUser =
              message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex ${
                  isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="mr-1 mt-1">
                    <CuteRobot small />
                  </div>
                )}

                <div
                  className={`max-w-[78%] whitespace-pre-line rounded-2xl px-3 py-2 text-[11px] leading-4 ${
                    isUser
                      ? "rounded-br-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm font-medium"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2">
              <CuteRobot small />

              <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {safeQuestions.length > 0 && (
          <div className="border-t border-slate-100 bg-white px-3 py-2">
            <div className="mb-1 flex items-center gap-1">
              <FiMessageCircle
                size={10}
                className="text-blue-600"
              />

              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Suggested
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {safeQuestions.map(
                (question, index) => (
                  <button
                    key={`${question}-${index}`}
                    type="button"
                    disabled={isTyping}
                    onClick={() =>
                      sendMessage(question)
                    }
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] text-slate-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
                  >
                    {question}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 bg-white p-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 transition focus-within:border-blue-500 focus-within:bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask about Santosh..."
              className="min-w-0 flex-1 bg-transparent px-2 py-1 text-xs text-slate-900 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={
                !input.trim() || isTyping
              }
              aria-label="Send message"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm transition hover:scale-105 disabled:opacity-30"
            >
              <FiSend size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}