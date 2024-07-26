"use client";

import Heading from "@/components/Heading";
import { Code, MessageSquare } from "lucide-react";
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
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
// import { ChatCompletionMessageParam } from "openai/resources/chat";
import ReactMarkdown from "react-markdown"

type Props = {};

const CodePage = (props: Props) => {
  const [output, setOutput] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          'Content-type':'application/json'
        },
        body:JSON.stringify({body:values.prompt})
      })
      const data = await response.json()
      if (response.ok) {
        setOutput(data.output)
      } else {
        setOutput(data.error)
      }
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate Code Using Descriptive Text"
        icon={Code}
        iconColor="text-green-500"
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
                        placeholder="Simple toggle button using React Hooks?"
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
          {output.length === 0 && !isLoading && (
            <div>
              <Empty label="No Conversation Started" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            <div
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg bg-muted"
              )}
            >
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  ),
                }}
                className="text-sm overflow-hidden leading-7"
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;


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