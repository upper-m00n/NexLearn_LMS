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
import enrolledCoursesRoutes from './routes/enrolledCoursesRoutes'

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // or whatever your frontend origin is
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
app.use('/api/enrolled-courses',enrolledCoursesRoutes);


app.get('/', (_req,res)=>{
    res.send("Api is workinng");
})

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))