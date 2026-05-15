"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="pt-20 text-center md:pt-32">
      <h1 className="mb-6">Something went wrong!</h1>
      <Button onClick={() => reset()} className="rounded-full">
        Try again
      </Button>
    </div>
  );
}
