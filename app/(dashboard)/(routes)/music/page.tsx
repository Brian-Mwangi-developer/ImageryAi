"use client";

import Heading from "@/components/Heading";
import {  Music } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown"
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";
type Props = {};

const MusicPage = (props: Props) => {
  const [music, setMusic] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const router = useRouter();
   const proModal = useProModal();
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);

      form.reset();
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
        title="Music Generation"
        description="Turn your Prompt Into Music"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0
                                          focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Generate a Piano Solo Song"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
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
          {!music && !isLoading && (
            <div>
              <Empty label="No Music Generated yet" />
            </div>
          )}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;



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