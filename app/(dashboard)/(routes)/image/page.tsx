"use client";

import Heading from "@/components/Heading";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Download, ImageIcon } from "lucide-react";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";
type Props = {};

const ImagePage = (props: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
   const proModal = useProModal();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          amount: values.amount,
          resolution: values.resolution,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setImages(data.images);
      } else {
        setImages(data.error);
      }
      form.reset();
      console.log(values);
    } catch (error: any) {
        if (error?.response?.status === 403) {
          proModal.onOpen();
        } else {
          toast.error("Something went Wrong");
        }
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn Your Prompt into a Beautiful Image"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm
                      grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0
                                          focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a Lion laughing at Home?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button className="col-span-12 lg:col-span-2 w-full">
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div
              className="p-8 rounded-lg w-full flex items-center
            justify-center bg-muted"
            >
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <div>
              <Empty label="No Images Generated" />
            </div>
          )}
          <div
            className="grid grid-cols-1 md:grids-cols-2 lg:grid-cols-3
          xl:grid-cols-4 gap-4 mt-8"
          >
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image alt="Image" fill src={src} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => window.open(src)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;

//Openai Alternative

// const userMessage: ChatCompletionMessageParam = {
//   role: "user",
//   content: values.prompt,
// };
// const newMessages = [...messages, userMessage];
// const response = await axios.post("/api/conversation", {
//   messages: newMessages,
// });
// console.log(response.data)
// setMessages((current) => [...current, userMessage, response.data]);

//chatgpt display
{
  /* {messages.map((message) => (
              <div key={message.content}>{message.content}</div>
            ))} */
}
//
