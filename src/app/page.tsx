"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

// Sample message data

function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleAddMessage(inputValue: string) {
    const newUserMessages = [
      ...messages,
      { id: uuidv4().toString(), sender: "user", text: inputValue },
    ] as Message[];
    setMessages(newUserMessages);

    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: inputValue }),
    });

    const data = await response.json();
    const responseText = data.responseMessage.kwargs.content;

    setMessages([
      ...newUserMessages,
      { id: uuidv4().toString(), sender: "bot", text: responseText },
    ]);
  }
  return (
    <div className="bg-gray-100 h-screen overflow-y-auto">
      <div className="mx-auto max-w-[750px] ">
        <ChatMessages messages={messages} />
        <ChatInput
          addMessage={(inputValue) => {
            handleAddMessage(inputValue);
          }}
        />
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

const ChatMessages = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="flex flex-col gap-6 p-5 mb-16">
      {/* mb-16 to account for input box */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={` rounded-lg p-3 ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

function ChatInput({
  addMessage,
}: {
  addMessage: (inputValue: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  async function handleSubmit() {
    addMessage(inputValue);
    setInputValue("");
  }

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 p-4 flex justify-center bg-gray-100">
      <div className="relative w-full max-w-[650px]">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          className="w-full p-4 pr-12 bg-gray-50 border-2 rounded-lg"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <div className="p-2">🔘</div>
        </button>
      </div>
    </div>
  );
}

export default Chat;
function useCallback(
  arg0: (e: any) => void,
  arg1: ((e: FormEvent<HTMLButtonElement>) => Promise<void>)[],
) {
  throw new Error("Function not implemented.");
}
