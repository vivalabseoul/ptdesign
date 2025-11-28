import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "./ui/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MenuIcon, NavigationIcon } from "lucide-react";

interface SectionNavProps {
  sections: Array<{ id: string; label: string }>;
}

export function SectionNav({ sections }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // 네비게이션 높이 + 여유공간

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const offsetTop = section.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // 네비게이션 높이 고려
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setSheetOpen(false); // 모바일에서 섹션 클릭 시 메뉴 닫기
    }
  };

  const MenuContent = () => (
    <div className="flex flex-col gap-1 px-3">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`px-4 py-3 rounded-lg text-left transition-colors text-lg font-medium ${
            activeSection === section.id
              ? "bg-primary text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-800"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="no-print fixed top-[96px] md:top-[104px] left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-3">
        {/* 데스크톱 네비게이션 - 가로 스크롤 */}
        <div className="hidden md:flex items-center justify-end gap-1 overflow-x-auto py-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-lg font-medium ${
                activeSection === section.id
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* 모바일 햄버거 메뉴 */}
        {isMobile && (
          <div className="flex items-center justify-end gap-2 py-3">
            <span className="text-white text-lg font-medium">바로가기</span>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                >
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">섹션 메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-gray-800 w-64 sm:w-64">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center gap-2">
                    <NavigationIcon className="h-5 w-5" />
                    바로가기
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <MenuContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </nav>
  );
}

