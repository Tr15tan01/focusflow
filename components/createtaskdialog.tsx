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
import { CollectionCollors, CollectionCollor } from "@/lib/constants";
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
    },
  });

  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const router = useRouter();

  const onSubmit = async (data: createTaskSchemaType) => {
    console.log("ausmbited", data);
    try {
      await createTask(data);
      toast({
        title: "created",
        description: "tasd creation siccess",
      });
      openChangeWrapper(false);
      router.refresh();
    } catch {
      toast({
        title: "error",
        description: "error creating",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add task to collection
            <span
              className={cn(
                "p-[1px] bg-clip-text text-transparent",
                CollectionCollors[collection.color as CollectionCollor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add task to collection, you can add as many tasks as you want
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              className="space-y-5 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cotnent</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="message here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At:</FormLabel>
                    <FormDescription>When the task expires</FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <FaRegCalendarAlt />
                            {field.value && format(field.value, "PPP")}
                            {!field.value && <span>No expiration</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            className={cn(
              "w-full dark:text-white",
              CollectionCollors[collection.color as CollectionCollor]
            )}
            onClick={form.handleSubmit(onSubmit)}
          >
            confirm{" "}
            {form.formState.isSubmitting && (
              <TfiReload className="animate-spin h-4" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateTaskDialog;
