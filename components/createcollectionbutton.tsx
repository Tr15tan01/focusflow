"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import CreateCollectionSheet from "./createcollectionsheet";

const CreateCollectionButton = () => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => setOpen(open);

  return (
    <div className="min-w-[400px] rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
      <Button
        variant={"outline"}
        className="w-full dark: bg-neutral-950 text-white"
        onClick={() => setOpen(true)}
      >
        <span className="bg-gradient-to-r from-red-500 to-orange-500 hover:to-orange-800 bg-clip-text text-transparent">
          Create Task
        </span>
      </Button>
      <CreateCollectionSheet open={open} onOpenChange={handleOpenChange} />
    </div>
  );
};
export default CreateCollectionButton;
