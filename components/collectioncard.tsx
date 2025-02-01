"use client";

import { Collection } from "@prisma/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionCollor, CollectionCollors } from "@/lib/constants";
import { useState } from "react";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { Progress } from "./ui/progress";

interface Props {
  collection: Collection;
}

const tasks: string[] = ["task one", "task two"];

const Collectioncard = ({ collection }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {collection.name}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full justify-between p-6",
              CollectionCollors[collection.color as CollectionCollor]
            )}
          >
            <span className="text-white font-bold">{collection.name}</span>
            {!isOpen && <CiCircleChevDown />}
            {isOpen && <CiCircleChevUp />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {tasks.length === 0 && <div>No tasks yet</div>}
          {tasks.length > 0 && (
            <>
              <Progress />
              <div>
                {tasks.map((task) => (
                  <div>mocked task</div>
                ))}
              </div>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
export default Collectioncard;
