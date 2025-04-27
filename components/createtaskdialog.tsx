// import { Collection } from "@prisma/client";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import { CollectionCollors, CollectionCollor } from "@/lib/constants";
// import { useForm } from "react-hook-form";
// import { createTaskSchema, createTaskSchemaType } from "@/schema/createTask";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { Textarea } from "./ui/textarea";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { Calendar } from "./ui/calendar";
// import { Button } from "./ui/button";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { format } from "date-fns";
// import { TfiReload } from "react-icons/tfi";
// import { createTask } from "@/actions/task";
// import { toast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";

// interface Props {
//   open: boolean;
//   collection: Collection;
//   setOpen: (open: boolean) => void;
// }

// const CreateTaskDialog = ({ open, collection, setOpen }: Props) => {
//   const form = useForm<createTaskSchemaType>({
//     resolver: zodResolver(createTaskSchema),
//     defaultValues: {
//       collectionId: collection.id,
//     },
//   });

//   const openChangeWrapper = (value: boolean) => {
//     setOpen(value);
//     form.reset();
//   };

//   const router = useRouter();

//   const onSubmit = async (data: createTaskSchemaType) => {
//     console.log("ausmbited", data);
//     try {
//       await createTask(data);
//       toast({
//         title: "created",
//         description: "tasd creation siccess",
//       });
//       openChangeWrapper(false);
//       router.refresh();
//     } catch {
//       toast({
//         title: "error",
//         description: "error creating",
//       });
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={openChangeWrapper}>
//       {/* <DialogTrigger>Open</DialogTrigger> */}
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             Add task to collection
//             <span
//               className={cn(
//                 "p-[1px] bg-clip-text text-transparent",
//                 CollectionCollors[collection.color as CollectionCollor]
//               )}
//             >
//               {collection.name}
//             </span>
//           </DialogTitle>
//           <DialogDescription>
//             Add task to collection, you can add as many tasks as you want
//           </DialogDescription>
//         </DialogHeader>
//         <div>
//           <Form {...form}>
//             <form
//               className="space-y-5 flex flex-col"
//               onSubmit={form.handleSubmit(onSubmit)}
//             >
//               <FormField
//                 control={form.control}
//                 name="content"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Cotnent</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         rows={4}
//                         placeholder="message here"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="expiresAt"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Expires At:</FormLabel>
//                     <FormDescription>When the task expires</FormDescription>
//                     <FormControl>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             className={cn(
//                               "justify-start text-left font-normal w-full",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             <FaRegCalendarAlt />
//                             {field.value && format(field.value, "PPP")}
//                             {!field.value && <span>No expiration</span>}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent>
//                           <Calendar
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </form>
//           </Form>
//         </div>
//         <DialogFooter>
//           <Button
//             disabled={form.formState.isSubmitting}
//             className={cn(
//               "w-full dark:text-white",
//               CollectionCollors[collection.color as CollectionCollor]
//             )}
//             onClick={form.handleSubmit(onSubmit)}
//           >
//             confirm{" "}
//             {form.formState.isSubmitting && (
//               <TfiReload className="animate-spin h-4" />
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
// export default CreateTaskDialog;

import { Collection } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CollectionColors, CollectionColor } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { createTaskSchema, createTaskSchemaType } from "@/schema/createTask";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { TfiReload } from "react-icons/tfi";
import { createTask } from "@/actions/task";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
// import { Input } from "./ui/input";

interface Props {
  open: boolean;
  collection: Collection;
  setOpen: (open: boolean) => void;
}

const CreateTaskDialog = ({ open, collection, setOpen }: Props) => {
  const form = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      collectionId: collection.id,
      content: "",
      expiresAt: undefined,
    },
  });

  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const router = useRouter();

  const onSubmit = async (data: createTaskSchemaType) => {
    try {
      await createTask(data);
      toast({
        title: "Task created",
        description: "Your task has been successfully created",
        variant: "default",
      });
      openChangeWrapper(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Could not create the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1">
            Add task to collection:{" "}
            <span
              className={cn(
                "p-[1px] bg-clip-text text-transparent font-bold",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add a new task to your collection. You can add as many tasks as you
            need.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Content</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Enter your task details here..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about what needs to be done
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select a due date</span>
                          )}
                          <FaRegCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When should this task be completed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => openChangeWrapper(false)}
                className="mt-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={cn(
                  "w-full dark:text-white font-semibold",
                  CollectionColors[collection.color as CollectionColor]
                )}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <TfiReload className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
