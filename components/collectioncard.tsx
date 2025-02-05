"use client";

import { Collection, Task } from "@prisma/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionCollor, CollectionCollors } from "@/lib/constants";
import { useMemo, useState, useTransition } from "react";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CreateTaskDialog from "./createtaskdialog";
import TaskCard from "./taskcard";

interface Props {
  collection: Collection & { tasks: Task[] };
}

// const tasks: string[] = ["task one", "task two"];

const Collectioncard = ({ collection }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, startTransition] = useTransition();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const tasks = collection.tasks;
  const router = useRouter();

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      console.log("deleted", collection.id);
      router.refresh();
      toast({
        title: "success",
        description: "collection deleted scuuess",
      });
    } catch {
      toast({
        title: "error",
        description: "collection deletion problem",
        variant: "destructive",
      });
    }
  };

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const totalTasks = collection.tasks.length;

  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return (
    <div className="w-full ">
      {/* {collection.name} */}
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
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
          {tasks.length === 0 && (
            <div className="p-4 justify-center">No tasks yet</div>
          )}
          {tasks.length > 0 && (
            <>
              <Progress
                className="rounded-none bg-red-500 dark:bg-red-600 h-[12px] my-[1px]"
                value={progress}
              />

              <div>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className="h-[40px] px-4 text-xs text-neutral-500 flex justify-between items-center">
            <p>Created At {collection.createdAt.toDateString()}</p>
            {isLoading && <div>Deleting...</div>}
            {!isLoading && (
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FaRegSquarePlus />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FaTrashAlt />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your task and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => startTransition(removeCollection)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
export default Collectioncard;
