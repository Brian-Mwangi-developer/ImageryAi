// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY,
// });

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

//     const response = await openai.createImage({
//       prompt,
//n:parseInt(amount,10,)
//       size: resolution
//     });

//     return NextResponse.json(response.data.data);

//   } catch (error) {
//     console.log("[CONVERSATION ERROR]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }

// }
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  const freeTrial = await checkApiLimit();
  const isPro = await checkSubscription();

  try {
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", {
        status: 403,
      });
    }
    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const data = await req.json();
    const { prompted, amount, resolution } = data;
    const prompt = `${prompted}\nAmount of images : ${amount}\n and Resolution: ${resolution}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Extract image URLs from the response
    const images = response.candidates!.map(
      (candidate) => candidate.content.parts
    );
    console.log("below are the images", images);
    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json({ images });
  } catch (error: any) {
    console.log(error);
  }
}
