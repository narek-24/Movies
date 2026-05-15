"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export default function ScrollTopButton() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon-lg"
      className="fixed bottom-4 z-50 cursor-pointer rounded-full bg-black text-white shadow-lg max-xl:left-4 md:size-12 xl:right-8 xl:bottom-8 dark:bg-white dark:text-black dark:shadow-lg/60"
      aria-label="Scroll to top"
    >
      <ArrowUp />
    </Button>
  );
}
