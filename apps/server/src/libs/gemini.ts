import { GoogleGenerativeAI,Part } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Lecture } from "../generated/prisma";



const prisma = new PrismaClient();

const genAI= new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model= genAI.getGenerativeModel({model:'gemini-1.5-flash'});

async function urlToGenetaivePart(url:string,mimeType:string) {
    const response= await axios.get(url,{responseType:'arraybuffer'});
    const buffer= Buffer.from(response.data,'binary');
    return{
        inlineData:{
            data:buffer.toString('base64'),
            mimeType
        }
    }
}

export async function processLectureWithGemini(lecture:Lecture){
    console.log(`Process lecture Id: ${lecture.id}`);

    try {
        const videoPart= await urlToGenetaivePart(lecture.videoUrl, 'video/mp4');

        const prompt= `You are an AI assistant for the 'NexLearn' e-learning platform.
        Your task is to analyze the provided lecture video and generate two pieces of content: a full transcript and a concise summary.

        Instructions:
        1.  **Transcript:** Create a complete and accurate text transcript of all spoken words in the video. Format it for readability.
        2.  **Summary:** Write a clear, professional summary of the lecture's key topics and learning objectives. This should be easily understandable for a student reviewing the material.

        Return the result as a single, valid JSON object with two keys: "transcript" and "summary". Do not include any extra text, introductions, or markdown code fences.

        Example JSON format:
        {
            "transcript": "Hello everyone, and welcome to our first lesson on Node.js...",
            "summary": "This lecture provides an introduction to Node.js, covering its core concepts, architecture, and use cases. Key topics include the event loop, non-blocking I/O, and how to set up a basic server."
        }`

        const result = await model.generateContent([prompt,videoPart]);
        const responseText= result.response.text();

        console.log("Received response from gemini");

        const {transcript,summary}=JSON.parse(responseText);

        if(!transcript || !summary){
            throw new Error('AI response is missing transcirpt or summary');
        }

        const updatedLecture= await prisma.lecture.update({
            where:{
                id:lecture.id
            },
            data:{
                transcript,
                summary
            }
        })

        console.log(`Successfully updated lecture Id: ${lecture.id}`)

        return updatedLecture;
    } catch (error) {
        console.error('Error during Gemini processing:', error);
        throw new Error('Failed to process lecture with Gemini AI.');
    }
}

