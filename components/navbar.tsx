"use client";
import { Navbar as HeroUINavbar } from "@heroui/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { setCookie, getCookie } from "cookies-next";

export const Navbar = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>("vi");
  const [isVisible, setIsVisible] = useState(true);

  const changeLanguage = () => {
    const newLang = currentLang === "vi" ? "en" : "vi";
    setCookie("pll_language", newLang);
    setCurrentLang(newLang);
    i18n?.changeLanguage(newLang);
  };

  useEffect(() => {
    const setLang = async () => {
      const currLang = (await getCookie("pll_language")) || "vi";
      if (currLang) {
        setCurrentLang(currLang);
        i18n?.changeLanguage(currLang);
      }
    };
    setLang();
  }, []);

  useEffect(() => {
    let scrollStartY = window.scrollY;
    let isScrolling = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!isScrolling) {
        scrollStartY = currentScrollY;
        isScrolling = true;
      }

      const scrollDistance = currentScrollY - scrollStartY;

      if (currentScrollY > 64) {
        // Hide header when scrolling down 50px from start position
        if (scrollDistance > 50) {
          setIsVisible(false);
        }
        // Show header when scrolling up 50px from start position
        else if (scrollDistance < -50) {
          setIsVisible(true);
        }
      } else {
        // Always show header when at top
        setIsVisible(true);
      }
    };

    const handleScrollEnd = () => {
      isScrolling = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, []);

  return (
    <HeroUINavbar
      className={`bg-header shadow-xl py-2 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      maxWidth="xl"
      position="sticky"
      style={{
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* <ThemeSwitch /> */}
      <Image
        alt="logo"
        className="py-2 h-[80px] cursor-pointer"
        height={100}
        src="/logo.png"
        width={200}
        onClick={() => (window.location.href = "https://ashno2025.com")}
      />
      <Button
        className="fixed top-4 right-7 z-50 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-2"
        onClick={changeLanguage}
      >
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {currentLang !== "vi" ? "English" : "Tiếng Việt"}
      </Button>
    </HeroUINavbar>
  );
};
