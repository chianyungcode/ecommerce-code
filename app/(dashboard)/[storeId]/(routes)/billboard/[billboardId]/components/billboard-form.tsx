"use client";

import AlertModal from "@/components/own/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hooks/use-origin";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Billboard } from "@prisma/client";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const actionbuttontext = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setIsLoading(true);

      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values,
        );
        console.log(response);
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/billboards`,
          values,
        );
        console.log(response);
      }

      router.refresh();

      toast.success(`${toastMessage}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // const onDelete = async () => {
  //   try {
  //     setIsLoading(true);

  //     const response = await axios.delete(`/api/stores/${params.storeId}`);
  //     console.log("Berhasil hapus data", response);

  //     router.refresh();
  //     router.push("/");

  //     toast.success("Store deleted");
  //   } catch (error) {
  //     toast.error("Make sure you removed all products and categories first");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onDelete = async () => {
    setIsLoading(true);

    toast
      .promise(
        axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`),
        {
          loading: "Deleting...",
          success: (res) => {
            console.log("Berhasil hapus data", res);
            router.refresh();
            router.push("/");
            return "Store deleted";
          },
          error:
            "Make sure you removed all categories using this billboard first",
        },
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isLoading}
            onClick={() => setIsOpen(true)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {actionbuttontext}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BillboardForm;
