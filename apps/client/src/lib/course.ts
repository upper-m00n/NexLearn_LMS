import {z} from 'zod'

export const courseSchema = z.object({
    title:z.string().min(3,"title should be minimum 3 characters long."),
    description:z.string().min(10),
    price:z.string()
})