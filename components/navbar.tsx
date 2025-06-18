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

  return (
    <HeroUINavbar
      className="bg-header shadow-xl py-2"
      maxWidth="xl"
      position="sticky"
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
