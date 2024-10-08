"use client";

import { useState } from "react";

function Page() {
  return (
    <div className="bg-gray-100 h-screen">
      <div className="mx-auto w-full max-w-[750px]">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}

// Sample message data
const messages = [
  { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  { id: 2, text: "I have a question about my account.", sender: "user" },
  {
    id: 3,
    text: "Sure, I'd be happy to help. What specifically would you like to know about your account?",
    sender: "bot",
  },
  {
    id: 4,
    text: "I can't seem to change my password. Can you guide me through the process?",
    sender: "user",
  },
  {
    id: 5,
    text: "Of course! To change your password, follow these steps:\n1. Go to Settings\n2. Click on 'Security'\n3. Select 'Change Password'\n4. Enter your current password, then your new password twice\n5. Click 'Save Changes'",
    sender: "bot",
  },
  { id: 6, text: "Thank you! I'll try that now.", sender: "user" },
  {
    id: 7,
    text: "You're welcome! Let me know if you need any further assistance.",
    sender: "bot",
  },
];

const ChatMessages = () => {
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

interface ChatInputProps {
  onSubmit: () => void;
}

function ChatInput() {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit() {
    console.log("inputValue:", inputValue);
  }

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 p-4 flex justify-center">
      <div className="relative w-full max-w-[650px]">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          className="w-full p-4 pr-12 bg-gray-50 border-2 rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onSubmit={handleSubmit}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <div className="p-2">🔘</div>
        </button>
      </div>
    </div>
  );
}

export default Page;
