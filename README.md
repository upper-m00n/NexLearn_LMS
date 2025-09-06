NexLearn-GenAI LMS: An AI-Powered E-Learning Platform
NexLearn is a full-stack, AI-enhanced e-learning platform designed to provide a seamless and intelligent educational experience for both trainers and students. The platform empowers trainers with comprehensive tools to create and manage courses, while students can easily search, enroll, and track their progress through a secure interface. What sets NexLearn apart is its deep integration of Generative AI to offer features that automate content creation and enhance the learning process.

Live Demo: https://nex-learn-lms.vercel.app/
-> Key Features
For Students
Authentication: Secure user registration and login.

Course Discovery: Search and browse a catalog of available courses.

Shopping Cart & Checkout: A complete workflow for purchasing courses using Razorpay.

Student Dashboard: View all enrolled courses and track overall progress.

Course Consumption: Access video lectures and downloadable PDF notes.

Ratings and Reviews: Provide feedback on completed courses.

Profile Management: Update personal information and profile picture.

For Trainers
Role-Based Access Control: A secure system differentiating trainers from students.

Course Management: Full CRUD (Create, Read, Update, Delete) functionality for courses.

Lecture Management: Full CRUD functionality for lectures within a course, including video and note uploads.

Trainer Dashboard: A centralized view to manage all created courses and student engagement.

->Generative AI Features
AI Transcripts & Summaries: Automatically generates a full text transcript and a concise summary for every video lecture using the Google Gemini API, making studying and revision more efficient.

AI-Generated Quizzes: Dynamically creates a multiple-choice quiz for each lecture based on its transcript content, allowing students to test their knowledge instantly.

AI Course Thumbnails: An innovative tool for trainers to instantly generate professional and relevant course thumbnails from just a title and category, powered by Google Cloud's text-to-image models.

🛠️ Tech Stack & Architecture
This project is a monorepo with a separate frontend and backend, deployed on different services for scalability and separation of concerns.

Frontend:

Framework: Next.js 14 (App Router)

Language: TypeScript

UI: React, Tailwind CSS, Shadcn UI

Deployment: Vercel

Backend:

Framework: Node.js, Express.js

Language: TypeScript

Database ORM: Prisma

Deployment: Render

Database:

Type: PostgreSQL

Deployment: Render

Generative AI & Cloud Services:

AI Models: Google Gemini API (for video processing and quizzes), Google Cloud AI Platform (for image generation).

Media Storage: Cloudinary (for video, notes, and thumbnail hosting).

Payments: Razorpay

🚀 Getting Started Locally
To run this project on your local machine, follow these steps.

Prerequisites
Node.js (v18 or later)

npm or yarn

Git

A local PostgreSQL instance

1. Clone the Repository
git clone [https://github.com/upper-m00n/NexLearn-GenAI-LMS.git](https://github.com/upper-m00n/NexLearn-GenAI-LMS.git)
cd NexLearn-GenAI-LMS

2. Backend Setup (apps/server)
Navigate to the server directory:

cd apps/server

Install dependencies:

npm install

Create a .env file and add the required environment variables (see .env.example).

Run Prisma migrations to set up your database schema:

npx prisma migrate dev

Start the backend development server:

npm run dev

The server will be running on http://localhost:4000.

3. Frontend Setup (apps/client)
Navigate to the client directory from the root:

cd apps/client

Install dependencies:

npm install

Create a .env.local file and add the required environment variables (see .env.local.example).

Start the frontend development server:

npm run dev

The frontend will be available at http://localhost:3000.

🔑 Environment Variables
To run this project, you will need to add the following environment variables.

Backend (apps/server/.env)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="YOUR_JWT_SECRET"
CORS_ORIGIN="http://localhost:3000"

# Google Cloud & Gemini
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
GCLOUD_PROJECT="YOUR_GOOGLE_CLOUD_PROJECT_ID"
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/gcloud-service-account.json"

# Cloudinary
CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"

# Razorpay
RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_KEY_SECRET"

Frontend (apps/client/.env.local)
NEXT_PUBLIC_BASE_URL="http://localhost:4000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"

📫 Contact
Ashutosh Sharma

GitHub: @upper-m00n

LinkedIn: Ashutosh Sharma

Portfolio: the3d-portfolio.vercel.app
