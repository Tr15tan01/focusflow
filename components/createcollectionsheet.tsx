// import {
//   createCollectionSchema,
//   createCollectionSchemaType,
// } from "@/schema/createCollection";
// import {
//   Sheet,
//   // SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "./ui/sheet";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CollectionCollor, CollectionCollors } from "@/lib/constants";
// import { cn } from "@/lib/utils";
// import { Separator } from "./ui/separator";
// import { createCollection } from "@/actions/collection";
// import { useToast } from "@/hooks/use-toast";

// interface Props {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const CreateCollectionSheet = ({ open, onOpenChange }: Props) => {
//   const form = useForm<createCollectionSchemaType>({
//     defaultValues: { name: "", color: "" },
//     resolver: zodResolver(createCollectionSchema),
//   });

//   const router = useRouter();

//   const onSubmit = async (data: createCollectionSchemaType) => {
//     console.log("submitted", data);
//     try {
//       createCollection(data);
//       onOpenChangeWrapper(false);
//       router.refresh();
//       toast({
//         title: "Well Done",
//         description: "Task is created",
//       });
//     } catch {
//       toast({
//         title: "OOOOPS",
//         description: "somethin gwent wrong",
//         variant: "destructive",
//       });
//       console.log("error creating");
//     }
//   };

//   const onOpenChangeWrapper = (open: boolean) => {
//     form.reset();
//     onOpenChange(open);
//   };

//   const { toast } = useToast();

//   return (
//     <Sheet open={open} onOpenChange={onOpenChangeWrapper}>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Add New Task</SheetTitle>
//           <SheetDescription>Add Content Here</SheetDescription>
//         </SheetHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="shadcn" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="color"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     {/* <Input placeholder="shadcn" {...field} /> */}
//                     <Select onValueChange={(color) => field.onChange(color)}>
//                       <SelectTrigger
//                         className={cn(
//                           `w-full h-8`,
//                           CollectionCollors[field.value as CollectionCollor]
//                         )}
//                       >
//                         <SelectValue placeholder="Color" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {/* <SelectItem value="light">Light</SelectItem>
//                         <SelectItem value="dark">Dark</SelectItem>
//                         <SelectItem value="system">System</SelectItem> */}

//                         {Object.keys(CollectionCollors).map((color) => (
//                           <SelectItem
//                             key={color}
//                             value={color}
//                             className={cn(
//                               `w-full rounded-md`,
//                               CollectionCollors[color as CollectionCollor]
//                             )}
//                           >
//                             {color}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormDescription>
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//         <div className="flex flex-col gap-3 mt-4">
//           <Separator />
//           <Button
//             onClick={form.handleSubmit(onSubmit)}
//             className={cn(
//               form.watch("color") &&
//                 CollectionCollors[form.getValues("color") as CollectionCollor]
//             )}
//             disabled={form.formState.isSubmitting}
//           >
//             Submit {form.formState.isSubmitting && <h3>Submitting...</h3>}
//           </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };
// export default CreateCollectionSheet;

import {
  createCollectionSchema,
  createCollectionSchemaType,
} from "@/schema/createCollection";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { createCollection } from "@/actions/collection";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCollectionSheet = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<createCollectionSchemaType>({
    defaultValues: { name: "", color: "" },
    resolver: zodResolver(createCollectionSchema),
  });

  const onSubmit = async (data: createCollectionSchemaType) => {
    try {
      await createCollection(data);
      toast({
        title: "Success!",
        description: "Collection created successfully",
      });
      onOpenChangeWrapper(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create collection",
        variant: "destructive",
      });
      console.error("Error creating collection:", error);
    }
  };

  const onOpenChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChangeWrapper}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Create New Collection
          </SheetTitle>
          <SheetDescription>
            Organize your tasks by creating a new collection
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Work Projects"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for your collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Theme</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "w-full h-10",
                          field.value &&
                            CollectionColors[field.value as CollectionColor]
                        )}
                      >
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(CollectionColors).map((color) => (
                        <SelectItem
                          key={color}
                          value={color}
                          className={cn(
                            "w-full my-1 rounded-md",
                            CollectionColors[color as CollectionColor],
                            "hover:opacity-90 transition-opacity"
                          )}
                        >
                          <span className="capitalize">{color}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pick a color to identify your collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 pt-4">
              <Separator />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={cn(
                  "w-full font-medium",
                  form.watch("color") &&
                    CollectionColors[form.getValues("color") as CollectionColor]
                )}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Collection"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCollectionSheet;
