import { Collection } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  };

  const onSubmit = async (data: createTaskSchemaType) => {
    console.log("ausmbited", data);
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogTrigger>Open</DialogTrigger>
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
                name="expires at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At:</FormLabel>
                    <FormDescription>When the task expires</FormDescription>
                    <FormControl></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateTaskDialog;
