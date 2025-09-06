
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

import prisma from '../prisma/client';
import { Lecture } from "@prisma/client";
import axios from "axios";
import { Request,Response } from "express";
import {v1} from '@google-cloud/aiplatform';
import { protos } from "@google-cloud/aiplatform";
import cloudinary from "./cloudinary";




const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


async function urlToGenerativePart(url: string, mimeType: string): Promise<Part> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    return {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType,
        },
    };
}

export async function processLectureWithGemini(lecture: Lecture) {
    console.log(`Processing lecture Id: ${lecture.id}`);

    try {
        const videoPart = await urlToGenerativePart(lecture.videoUrl, 'video/mp4');

        const prompt =  `You are an AI assistant for the 'NexLearn' e-learning platform.
        Your task is to analyze the provided lecture video and generate two distinct pieces of content.

        Return the result as a single, valid JSON object with ONLY two keys: "transcript" and "summary". Do not include any extra text, introductions, or markdown code fences like \`\`\`json.

        1.  **"transcript":** Provide a complete and accurate text transcript of all spoken words in the video.
        2.  **"summary":** Analyze the transcript and write a unique summary of the lecture's key concepts. Explain the main learning objectives in your own words. This summary is for a student reviewing the material.

        Example JSON format:
        {
          "transcript": "Hello everyone, and welcome to our first lesson on Node.js...",
          "summary": "This lecture introduces the fundamentals of Node.js, focusing on its core architecture and primary use cases. Students will learn about the event loop and non-blocking I/O to understand how Node.js handles asynchronous tasks efficiently."
        }`;

        const result = await model.generateContent([prompt, videoPart]);
        let responseText = result.response.text();

        console.log("Received response from gemini");

        if (responseText.startsWith("```json")) {
            responseText = responseText.substring(7, responseText.length - 3);
        }

        const { transcript, summary } = JSON.parse(responseText);

        if (!transcript || !summary) {
            // FIX: Corrected typo in 'transcirpt'
            throw new Error('AI response is missing transcript or summary');
        }

        const updatedLecture = await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                transcript,
                summary
            }
        });

        console.log(`Successfully updated lecture Id: ${lecture.id}`);
        return updatedLecture;

    } catch (error) {
        console.error('Error during Gemini processing:', error);
        throw new Error('Failed to process lecture with Gemini AI.');
    }
}

export async function generateQuizForLecture(lectureId:string) {
    console.log(`Starting quiz generation for lecture Id:${lectureId}`);

    const lecture= await prisma.lecture.findUnique({
        where:{
            id:lectureId,
        },
        select:{
            transcript:true,
            title:true
        }
    })

    if(!lecture || !lecture.transcript){
        throw new Error('Lecture or transcript not found.');
    }

    const prompt=`
    You are an expert quiz designer for the 'NexLearn' e-learning platform.
    Your task is to create a 5-question multiple-choice quiz based on the provided lecture transcript. The questions should test key concepts and learning objectives.

    LECTURE TRANSCRIPT:
    "${lecture.transcript}"

    Return the result as a single, valid JSON object. The JSON object must have a single key "questions", which is an array of question objects. Each question object must have three keys: "text" (the question), "options" (an array of 4 strings), and "correctAnswer" (the 0-based index of the correct option).

    IMPORTANT: The response MUST be only the JSON object, starting with { and ending with }. Do not include markdown code fences or any other text.
    
    Example JSON format:
    {
      "questions": [
        {
          "text": "What is the primary function of the event loop in Node.js?",
          "options": ["To execute code line-by-line", "To manage asynchronous operations", "To render HTML", "To compile code"],
          "correctAnswer": 1
        }
      ]
    }
  `;

  const result= await model.generateContent(prompt);

  let resText= result.response.text();

  if(resText.startsWith("```json")){
    resText=resText.substring(7,resText.length-3);
  }

  const {questions}= JSON.parse(resText);

  if(!questions || !Array.isArray(questions) || questions.length===0){
    throw new Error('AI failed to generate valid questions');
  }

  const newQuiz= await prisma.quiz.create({
    data:{
        lectureId:lectureId,
        questions:{
            create:questions.map((q:any)=>({
                text:q.text,
                options:q.options,
                correctAnswer:q.correctAnswer
            }))
        },
    },
    include:{
        questions:true
    }
  })

  console.log(`Successfully generated quiz for lecture Id:${lectureId}`);
    return newQuiz;

}


// image generation for thumbnail

const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};
const predictionServiceClient = new v1.PredictionServiceClient(clientOptions);

type IPredictRequest = protos.google.cloud.aiplatform.v1.IPredictRequest;
type IValue = protos.google.protobuf.IValue;

export const generateThumbnail = async (req: Request, res: Response) => {
  const { title, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: 'Title and category are required' });
  }

  try {
   const prompt = `Create a professional thumbnail for an online course titled "${title}".

**Primary Requirement:** The full title, "${title}", must be clearly visible and legible on the image. Use a clean, modern, sans-serif font.

**Background Art:** The background must be a vibrant, minimalist, digital art illustration that is directly related to the course topic. It should be an abstract visualization of concepts like data, databases, SQL code, and analytics. For example, use glowing lines representing data flows, interconnected nodes forming a database schema, or artistic graphs and charts.

**Negative Constraints:** Do not use photographs, stock images, or depictions of people. The focus must be on clean, abstract graphics that are relevant to the course title.
`;

    const project = process.env.GCLOUD_PROJECT;
    const endpoint = `projects/${project}/locations/us-central1/publishers/google/models/imagegeneration@005`;

    const instances: IValue[] = [{
      structValue: {
        fields: {
          prompt: { stringValue: prompt },
        },
      },
    }];

    const parameters: IValue = {
      structValue: {
        fields: {
          sampleCount: { numberValue: 1 },
          width:{numberValue:1536},
          height:{numberValue:864}
        },
      },
    };

    const request: IPredictRequest = {
      endpoint,
      instances,
      parameters,
    };
    const callOptions={
        timeout:120000
    }
    
    const [response] = await predictionServiceClient.predict(request,callOptions);

    if (!response.predictions || response.predictions.length === 0) {
      throw new Error('AI response did not contain predictions.');
    }

    const base64ImageData = response.predictions[0].structValue?.fields?.bytesBase64Encoded.stringValue;

    if (!base64ImageData) {
      throw new Error('No image data received from the AI model');
    }

    const uploadedImage = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64ImageData}`,
      {
        folder: 'thumbnails',
        resource_type: 'image',
      }
    );

    console.log(`Uploaded to Cloudinary, secure URL: ${uploadedImage.secure_url}`);
    res.status(200).json({ thumbnailUrl: uploadedImage.secure_url });

  } catch (error) {
    console.error('Error generating AI thumbnail:', error);
    res.status(500).json({ message: 'Failed to generate AI thumbnail.' });
  }
};