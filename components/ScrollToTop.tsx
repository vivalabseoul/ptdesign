import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 스크롤이 300px 이상 내려갔을 때 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-40 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg transition-all duration-300 no-print"
      aria-label="맨 위로 이동"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}

