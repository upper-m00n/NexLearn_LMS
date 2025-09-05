import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

//import routess here
import authRoutes from './routes/authRoutes'
import courseRoutes from './routes/courseRoutes'
import imagekitRoutes from './routes/imagekitRoutes'
import lectureRoutes from './routes/lectureRoutes'
import cartRoutes from './routes/cartRoutes'
import userRoutes from './routes/userRoutes'
import paymentRoutes from './routes/paymentRoutes'
import enrollmentRoutes from './routes/enrolledCoursesRoutes'
import ratingRoutes from './routes/ratingRoutes'
import quizRoutes from './routes/quizRoutes'
import progressRoutes from './routes/progressRoutes'

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://nex-learn-j0p5byx6o-ashutosh-sharmas-projects-da368800.vercel.app', 
    credentials: true
}));

app.use(express.json());

// use routes
app.use('/api/auth',authRoutes);
app.use('/api/course',courseRoutes);
app.use('/api/imagekit',imagekitRoutes);
app.use('/api/lecture',lectureRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/user',userRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/enrolled-courses',enrollmentRoutes);
app.use('/api/ratings',ratingRoutes);
app.use('/api/quizzes',quizRoutes);
app.use('/api/progress',progressRoutes);

app.get('/', (_req,res)=>{
    res.send("Api is workinng");
})

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))