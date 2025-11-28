import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { XIcon, SendIcon, MessageCircleIcon, Minimize2Icon } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! Pro Touch Design 챗봇입니다. 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("안녕") || input.includes("hello") || input.includes("hi")) {
      return "안녕하세요! 무엇을 도와드릴까요?";
    }
    if (input.includes("가격") || input.includes("비용") || input.includes("price")) {
      return "베이직 플랜은 ₩50,000원, 프로 플랜은 ₩120,000원입니다. 자세한 내용은 가격 정책 섹션을 확인해주세요.";
    }
    if (input.includes("분석") || input.includes("analyze")) {
      return "URL을 입력하시면 AI가 자동으로 UI/UX를 분석하고 개선 보고서를 제공합니다. 홈 페이지에서 무료로 시작하실 수 있습니다.";
    }
    if (input.includes("결제") || input.includes("payment")) {
      return "결제는 토스페이먼츠를 통해 안전하게 진행됩니다. 결제 관련 문의사항이 있으시면 연락처로 문의해주세요.";
    }
    if (input.includes("로그인") || input.includes("login")) {
      return "로그인 페이지에서 이메일과 비밀번호로 로그인하실 수 있습니다. 계정이 없으시면 회원가입을 진행해주세요.";
    }
    if (input.includes("문의") || input.includes("contact") || input.includes("연락")) {
      return "문의사항은 문의하기 섹션의 폼을 작성해주시거나, 이메일(contact@protouch.design)로 연락주세요.";
    }
    if (input.includes("서비스") || input.includes("service")) {
      return "Pro Touch Design은 AI 기반 웹사이트 UI/UX 분석 서비스입니다. 전문가 수준의 분석 보고서와 개선 방안을 제공합니다.";
    }

    return "죄송합니다. 더 자세한 정보는 문의하기 섹션에서 문의해주시거나, 홈페이지의 각 섹션을 확인해주세요. 무엇을 도와드릴까요?";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg transition-all duration-300 no-print"
        aria-label="챗봇 열기"
      >
        <MessageCircleIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl transition-all duration-300 no-print ${
        isMinimized ? "h-16 w-80" : "h-[600px] w-96"
      } flex flex-col border border-gray-200`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircleIcon className="h-5 w-5" />
          <span className="font-semibold">Pro Touch Design</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 rounded p-1 transition-colors"
            aria-label={isMinimized ? "확대" : "축소"}
          >
            <Minimize2Icon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="닫기"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

