"use client";
import { Navbar as HeroUINavbar } from "@heroui/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(
    i18n?.language || "vi"
  );

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop()?.split(";").shift();

    return null;
  };

  const setCookie = (name: string, value: string, days: number = 365) => {
    const expires = new Date();

    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    console.log(`Cookie set: ${name}=${value}`);
  };

  const changeLanguage = () => {
    const newLang = currentLang === "vi" ? "en" : "vi";

    // Set cookie immediately
    setCookie("pll_language", newLang);

    // Update state and i18n
    setCurrentLang(newLang);
    i18n?.changeLanguage(newLang);
  };

  useEffect(() => {
    const lang = getCookie("pll_language") || i18n?.language || "vi";

    console.log("Current language:", getCookie("pll_language"));
    setCurrentLang(lang as string);
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
        className="py-2 h-[80px]"
        height={100}
        src="/logo.png"
        width={200}
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
        {currentLang === "vi" ? "English" : "Tiếng Việt"}
      </Button>
    </HeroUINavbar>
  );
};
