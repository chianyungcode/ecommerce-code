"use client";

import AlertModal from "@/components/own/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hooks/use-origin";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Store } from "@prisma/client";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1),
});
interface SettingFormProps {
  initialData: Store;
}

type SettingFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: SettingFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/stores/${params.storeId}`,
        values,
      );
      console.log(response);

      router.refresh();

      toast.success("Store name updated!");
    } catch (error) {
      toast.error("Something went wrong when fetching data");
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
      .promise(axios.delete(`/api/stores/${params.storeId}`), {
        loading: "Deleting...",
        success: (res) => {
          console.log("Berhasil hapus data", res);
          router.refresh();
          router.push("/");
          return "Store deleted";
        },
        error: "Make sure you removed all products and categories first",
      })
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
        <Heading title="Settings" description="Manage Store" />
        <Button
          variant="destructive"
          size="icon"
          disabled={isLoading}
          onClick={() => setIsOpen(true)}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
