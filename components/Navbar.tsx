import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useIsMobile } from "./ui/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MenuIcon } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, appUser } = useAuth();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  // 디버깅: 관리자 권한 확인
  console.log("🔍 Navbar - isAuthenticated:", isAuthenticated);
  console.log("🔍 Navbar - isAdmin:", isAdmin);
  console.log("🔍 Navbar - appUser:", appUser);
  console.log("🔍 Navbar - appUser?.role:", appUser?.role);

  const MenuContent = ({
    isMobileMenu = false,
  }: {
    isMobileMenu?: boolean;
  }) => (
    <>
      {isAuthenticated ? (
        <>
          {/* 사용자 이메일 표시 */}
          {appUser?.email && (
            <span className={`text-gray-300 text-sm ${isMobileMenu ? "mb-2" : "mr-2"}`}>
              {appUser.email}
            </span>
          )}
          <Button
            onClick={() => {
              navigate("/dashboard");
              setSheetOpen(false);
            }}
            variant="outline"
            className={`btn-admin ${isMobileMenu ? "w-full" : ""}`}
          >
            마이페이지
          </Button>
          {isAdmin && (
            <Button
              onClick={() => {
                navigate("/admin");
                setSheetOpen(false);
              }}
              variant="outline"
              className={`btn-admin ${isMobileMenu ? "w-full" : ""}`}
            >
              관리자
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              navigate("/login");
              setSheetOpen(false);
            }}
            variant="outline"
            className={`btn-admin ${isMobileMenu ? "w-full" : ""}`}
          >
            로그인
          </Button>
          <Button
            onClick={() => {
              navigate("/signup");
              setSheetOpen(false);
            }}
            variant="outline"
            className={`btn-admin ${isMobileMenu ? "w-full" : ""}`}
          >
            회원가입
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 no-print pt-6">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-4 max-w-7xl">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2 md:gap-3 overflow-hidden">
          {/* 로고 */}
          <button
            onClick={() => navigate("/")}
            className="text-lg md:text-xl font-bold text-white hover:text-primary transition-colors whitespace-nowrap flex-shrink-0 truncate max-w-[40%] md:max-w-none"
          >
            Pro Touch Design
          </button>

          {/* 데스크톱 네비게이션 메뉴 - 우측 정렬 */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            <MenuContent isMobileMenu={false} />
          </div>

          {/* 모바일 햄버거 메뉴 */}
          {isMobile && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800 flex-shrink-0"
                >
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-black border-gray-800 w-64 sm:w-64"
              >
                <SheetHeader>
                  <SheetTitle className="text-white">메뉴</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-1 px-3">
                  <MenuContent isMobileMenu={true} />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
