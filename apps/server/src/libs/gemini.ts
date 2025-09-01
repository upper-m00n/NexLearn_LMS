
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

import { PrismaClient, Lecture } from "../generated/prisma"; 
import axios from "axios";
import { response } from "express";


const prisma = new PrismaClient();

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

        const prompt = `You are an AI assistant for the 'NexLearn' e-learning platform.
        Your task is to analyze the provided lecture video and generate two pieces of content: a full transcript and a concise summary.

        Instructions:
        1.  **Transcript:** Create a complete and accurate text transcript of all spoken words in the video. Format it for readability.
        2.  **Summary:** Write a clear, professional summary of the lecture's key topics and learning objectives. This should be easily understandable for a student reviewing the material.

        Return the result as a single, valid JSON object with two keys: "transcript" and "summary". Do not include any extra text, introductions, or markdown code fences.

        Example JSON format:
        {
            "transcript": "Hello everyone, and welcome to our first lesson on Node.js...",
            "summary": "This lecture provides an introduction to Node.js, covering its core concepts, architecture, and use cases. Key topics include the event loop, non-blocking I/O, and how to set up a basic server."
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

