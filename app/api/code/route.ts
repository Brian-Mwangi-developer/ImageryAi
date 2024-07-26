// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY,
// });

// const instructionMessage: CreateChatCompletionRequestMessage = {
//   role: "system",
//   content: "You are a code Generator, you must answer only in markdown code snippets. Use code comments for explanation"
// }
// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { messages } = body;
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     // if (!configuration.apiKey) {
//     //   return new NextResponse("OpenAI API key not configured", { status: 500 });
//     // }
//     if (!messages) {
//       return new NextResponse("Messages are Required", { status: 400 });
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages:[instructionMessage, ...messages]
//     });

//     return NextResponse.json(response.choices[0].message);

//   } catch (error) {
//     console.log("[CODE ERROR]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

//GEMINI AI BELOW

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const data = await req.json();
    const userPrompt = data.body;

    // Instruct the model to respond in Markdown code snippets with comments
    const systemPrompt = `You are a code generator. Provide responses exclusively in Markdown code snippets, 
    including clear comments for explanation.`;

    // Concatenate the instruction with the user's prompt
    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();

    return NextResponse.json({ output: output });
  } catch (error: any) {
    console.log(error);
  }
}
