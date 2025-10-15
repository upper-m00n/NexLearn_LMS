import z from 'zod'

const lectureSchema = z.object({
    title:z.string().min(3,"Title should be minimum of 3 characters"),
    description:z.string().min(10,"Desrciption should be 10 characters long"),
    video:z.any(),
    note:z.any()
})

export default lectureSchema