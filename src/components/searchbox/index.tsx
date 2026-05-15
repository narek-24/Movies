"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("./content"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[448px] max-h-[80vh] place-content-center">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

export default function Searchbox() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="md:bg-input text-muted-foreground border-input-border rounded-full max-md:size-9 md:border"
          >
            <Search className="mr-1 size-5" />
            <span className="font-medium max-md:sr-only">
              Search for movie, TV show or person
            </span>
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Content setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
