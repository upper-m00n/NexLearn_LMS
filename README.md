# NexLearn-GenAI LMS: An AI-Powered E-Learning Platform

**NexLearn** is a full-stack, AI-enhanced e-learning platform designed to provide a seamless and intelligent educational experience for both trainers and students.  
The platform empowers trainers with comprehensive tools to create and manage courses, while students can easily search, enroll, and track their progress through a secure interface.  

✨ What sets NexLearn apart is its deep integration of **Generative AI** to automate content creation and enhance the learning process.

🔗 **Live Demo**: [https://nex-learn-lms.vercel.app/](https://nex-learn-lms.vercel.app/)

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Authentication**: Secure user registration and login.  
- **Course Discovery**: Search and browse a catalog of available courses.  
- **Shopping Cart & Checkout**: Purchase courses with **Razorpay integration**.  
- **Student Dashboard**: Track enrolled courses and overall progress.  
- **Course Consumption**: Access **video lectures** and **downloadable PDF notes**.  
- **Ratings & Reviews**: Provide feedback on completed courses.  
- **Profile Management**: Update personal information and profile picture.  

### 👨‍🏫 For Trainers
- **Role-Based Access Control**: Secure system differentiating trainers from students.  
- **Course Management**: Full CRUD operations for courses.  
- **Lecture Management**: Full CRUD operations for lectures, including **video** and **note uploads**.  
- **Trainer Dashboard**: Centralized view for course and student engagement management.  

---

## 🤖 Generative AI Features
- **AI Transcripts & Summaries**: Generates lecture transcripts & concise summaries using **Google Gemini API**.  
- **AI-Generated Quizzes**: Creates dynamic MCQs for each lecture based on transcript content.  
- **AI Course Thumbnails**: Generates professional thumbnails from a course title & category using **Google Cloud’s text-to-image models**.  

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)  
- **Language**: TypeScript  
- **UI**: React, Tailwind CSS, Shadcn UI  
- **Deployment**: Vercel  

### Backend
- **Framework**: Node.js, Express.js  
- **Language**: TypeScript  
- **ORM**: Prisma  
- **Deployment**: Render  

### Database
- **Type**: PostgreSQL  
- **Deployment**: Render  

### Cloud & AI Services
- **AI Models**: Google Gemini API (video processing & quizzes)  
- **Image Generation**: Google Cloud AI Platform  
- **Media Storage**: Cloudinary (video, notes, thumbnails)  
- **Payments**: Razorpay  

---

## 🖥️ Getting Started Locally

### ✅ Prerequisites
- Node.js (v18 or later)  
- npm or yarn  
- Git  
- Local PostgreSQL instance  

---

### 1. Clone the Repository
```bash
git clone https://github.com/upper-m00n/NexLearn-GenAI-LMS.git
cd NexLearn-GenAI-LMS
```

### 2. Backend Setup (apps/server)
```bash
cd apps/server
npm install
```
Create a .env file and configure variables (see .env.example).
- Run Prisma migrations:
```bash
npx prisma migrate dev
```

Start the backend:
```bash
npm run dev
```
- Backend runs on http://localhost:4000

3. Frontend Setup (apps/client)
```bash
cd apps/client
npm install
```
- Create .env.local and configure variables (see .env.local.example).

- Start the frontend:
``` bash
npm run dev
Frontend runs on http://localhost:3000
```

Environment Variables
Backend (apps/server/.env)

``` bash
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
```

Frontend (apps/client/.env.local)
```bash
NEXT_PUBLIC_BASE_URL="http://localhost:4000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"
```

Ashutosh Sharma

GitHub: @upper-m00n

LinkedIn: Ashutosh Sharma

Portfolio: the3d-portfolio.vercel.app

