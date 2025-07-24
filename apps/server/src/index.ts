import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

//import routess here
import authRoutes from './routes/authRoutes'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// use routes

app.use('/api/auth',authRoutes)

app.get('/', (_req,res)=>{
    res.send("Api is workinng");
})

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))