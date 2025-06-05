"use client";
import { Navbar as HeroUINavbar } from "@heroui/navbar";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n?.language || "vi");

  const changeLanguage = () => {
    const newLang = currentLang === "vi" ? "en" : "vi";

    i18n?.changeLanguage(newLang).then(() => {
      setCurrentLang(newLang);
    });
  };
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-header shadow-xl py-2"
    >
      {/* <ThemeSwitch /> */}
      <Image
        src="/logo.png"
        alt="logo"
        className="py-2 h-[80px]"
        width={200}
        height={100}
      />
      <Button
        className="fixed top-4 right-7 z-50 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
        onClick={changeLanguage}
      >
        {currentLang === "vi" ? "English" : "Tiếng Việt"}
      </Button>
    </HeroUINavbar>
  );
};
