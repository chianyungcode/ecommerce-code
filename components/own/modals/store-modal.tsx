"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal = () => {
  const storeModals = useStoreModal();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      toast.promise(axios.post("/api/stores", values), {
        loading: "Loading",
        success: (response) => {
          storeModals.onClose();
          console.log(response.data);
          setIsLoading(false);
          return "Store created successfully";
        },
        error: "Failed to create store",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage product and categories"
      isOpen={storeModals.isOpen}
      onClose={storeModals.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  onClick={storeModals.onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
