// import { Task } from "@prisma/client";
// import { Checkbox } from "./ui/checkbox";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { useTransition } from "react";
// import { setTaskDone } from "@/actions/task";
// import { useRouter } from "next/navigation";

// const getExpirationColor = (expiresAt: Date) => {
//   const days = Math.floor(expiresAt.getTime() - Date.now() / 1000 / 60 / 60);
//   if (days <= 3 * 24) return "text-red-500";
//   if (days <= 7 * 24) return "text-orange-500";
//   return "text-green-500";
// };

// const TaskCard = ({ task }: { task: Task }) => {
//   const [isLoading, startTransition] = useTransition();
//   const router = useRouter();
//   return (
//     <div className="flex gap-2 items-start my-3">
//       <Checkbox
//         id={task.id.toString()}
//         className="w-5 h-5 m-3"
//         checked={task.done}
//         disabled={isLoading}
//         onCheckedChange={() => {
//           startTransition(async () => {
//             await setTaskDone(task.id);
//             router.refresh();
//           });
//         }}
//       />
//       <label
//         htmlFor={task.id.toString()}
//         className={cn("text-sm ", task.done && "line-through")}
//       />
//       <label>
//         {task.content}
//         {task.expiresAt && (
//           <p
//             className={cn(
//               "text-xs text-neutral-500 dark:text-neutral-400",
//               getExpirationColor(task.expiresAt)
//             )}
//           >
//             {format(task.expiresAt, "dd/mm/yy")}
//           </p>
//         )}
//       </label>
//     </div>
//   );
// };
// export default TaskCard;
import { Task } from "@prisma/client";
import { Checkbox } from "./ui/checkbox";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { setTaskDone } from "@/actions/task";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const expirationStyles = task.expiresAt
    ? getExpirationStyles(task.expiresAt)
    : null;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <Checkbox
        id={task.id.toString()}
        className={cn(
          "w-5 h-5 mt-0.5 transition-colors duration-200",
          task.done ? "border-gray-400" : "border-gray-300 dark:border-gray-600"
        )}
        checked={task.done}
        disabled={isLoading}
        onCheckedChange={() => {
          startTransition(async () => {
            await setTaskDone(task.id);
            router.refresh();
          });
        }}
      />

      <div className="flex-1">
        <label
          htmlFor={task.id.toString()}
          className={cn(
            "block text-sm font-medium leading-snug cursor-pointer",
            task.done && "line-through text-gray-500 dark:text-gray-400"
          )}
        >
          {task.content}
        </label>

        {task.expiresAt && (
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full",
                expirationStyles?.dot
              )}
            />
            <p className={cn("text-xs font-medium", expirationStyles?.text)}>
              {differenceInDays(task.expiresAt, new Date()) < 0
                ? `Expired on ${format(task.expiresAt, "MMM d")}`
                : `${format(task.expiresAt, "MMM d")} (${Math.abs(
                    differenceInDays(task.expiresAt, new Date())
                  )}d)`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
