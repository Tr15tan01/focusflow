import { Task } from "@prisma/client";
import { Checkbox } from "./ui/checkbox";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransition, useState } from "react";
import { setTaskDone, deleteTask, updateTask } from "@/actions/task";
import { useRouter } from "next/navigation";
import { FaTrashAlt, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
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
import { toast } from "@/hooks/use-toast";
import { Input } from "./ui/input";

const getExpirationStyles = (expiresAt: Date) => {
  const daysLeft = differenceInDays(expiresAt, new Date());

  if (daysLeft < 0)
    return {
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500 dark:bg-red-400",
    };
  if (daysLeft <= 3)
    return {
      text: "text-red-500 dark:text-red-300",
      dot: "bg-red-500 dark:bg-red-300",
    };
  if (daysLeft <= 7)
    return {
      text: "text-amber-500 dark:text-amber-300",
      dot: "bg-amber-500 dark:bg-amber-300",
    };
  return {
    text: "text-emerald-500 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  };
};

const TaskCard = ({ task }: { task: Task }) => {
  const [isLoading, startTransition] = useTransition();
  const [isDeleting, startDeletingTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [isSaving, startSavingTransition] = useTransition();
  const router = useRouter();

  const expirationStyles = task.expiresAt
    ? getExpirationStyles(task.expiresAt)
    : null;

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      router.refresh();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() === "") {
      toast({
        title: "Error",
        description: "Task content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (editedContent === task.content) {
      setIsEditing(false);
      return;
    }

    startSavingTransition(async () => {
      try {
        await updateTask(task.id, editedContent);
        router.refresh();
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancelEdit = () => {
    setEditedContent(task.content);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
        (isDeleting || isLoading || isSaving) &&
          "opacity-70 pointer-events-none"
      )}
    >
      {/* Checkbox with loading state */}
      <div className="relative">
        <Checkbox
          id={task.id.toString()}
          className={cn(
            "w-5 h-5 mt-0.5 transition-colors duration-200",
            task.done
              ? "border-gray-400"
              : "border-gray-300 dark:border-gray-600",
            (isLoading || isDeleting || isSaving) && "opacity-50"
          )}
          checked={task.done}
          disabled={isLoading || isDeleting || isSaving}
          onCheckedChange={() => {
            startTransition(async () => {
              await setTaskDone(task.id);
              router.refresh();
            });
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              disabled={isSaving}
              className="h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center gap-1 text-xs"
              >
                {isSaving ? (
                  <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaCheck size={12} />
                )}
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-1 text-xs"
              >
                <FaTimes size={12} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <label
              htmlFor={task.id.toString()}
              className={cn(
                "block text-sm font-medium leading-snug cursor-pointer",
                task.done && "line-through text-gray-500 dark:text-gray-400",
                (isLoading || isDeleting || isSaving) && "opacity-70"
              )}
            >
              {task.content}
              {isLoading && (
                <span className="ml-2 inline-flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 ml-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 ml-1 bg-blue-500 rounded-full animate-bounce"></span>
                </span>
              )}
            </label>

            {task.expiresAt && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full",
                    expirationStyles?.dot,
                    (isLoading || isDeleting || isSaving) && "opacity-70"
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-medium",
                    expirationStyles?.text,
                    (isLoading || isDeleting || isSaving) && "opacity-70"
                  )}
                >
                  {differenceInDays(task.expiresAt, new Date()) < 0
                    ? `Expired on ${format(task.expiresAt, "MMM d")}`
                    : `${format(task.expiresAt, "MMM d")} (${Math.abs(
                        differenceInDays(task.expiresAt, new Date())
                      )}d)`}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-1">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading || isDeleting || isSaving}
            className={cn(
              "text-blue-500 hover:text-blue-700 transition-colors p-1",
              (isLoading || isDeleting || isSaving) &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            <FaEdit size={14} />
          </button>
        )}

        {/* Delete button with confirmation dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                "text-red-500 hover:text-red-700 transition-colors p-1",
                (isLoading || isDeleting || isSaving) &&
                  "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading || isDeleting || isSaving}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaTrashAlt size={14} />
              )}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent
            className={
              isLoading || isDeleting || isSaving
                ? "opacity-70 pointer-events-none"
                : ""
            }
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this task?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading || isDeleting || isSaving}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startDeletingTransition(handleDeleteTask)}
                className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                disabled={isLoading || isDeleting || isSaving}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default TaskCard;
