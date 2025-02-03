import { Task } from "@prisma/client";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { useTransition } from "react";
import { setTaskDone } from "@/actions/task";
import { useRouter } from "next/navigation";

const getExpirationColor = (expiresAt: Date) => {
  const days = Math.floor(expiresAt.getTime() - Date.now() / 1000 / 60 / 60);
  if (days <= 3 * 24) return "text-red-500";
  if (days <= 7 * 24) return "text-orange-500";
  return "text-green-500";
};

const TaskCard = ({ task }: { task: Task }) => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div className="flex gap-2 items-start my-3">
      <Checkbox
        id={task.id.toString()}
        className="w-5 h-5"
        checked={task.done}
        disabled={isLoading}
        onCheckedChange={() => {
          startTransition(async () => {
            await setTaskDone(task.id);
            router.refresh();
          });
        }}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn("text-sm ", task.done && "line-through")}
      />
      <label>
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt)
            )}
          >
            {format(task.expiresAt, "dd/mm/yy")}
          </p>
        )}
      </label>
    </div>
  );
};
export default TaskCard;
