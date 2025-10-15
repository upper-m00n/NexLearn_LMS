export type Item={
    id:string;
    courseId:string;
    price:number;
    order?:Order;
    orderId:string;
    createdAt:Date;
    course?:Course;
}

export type Order={
    id:string;
    //student:Student;
    studentId:string;
    paymentId?:string;
    //payment?:Payment;
    items:Item[];
    createdAt:Date;
}

type Course = {
  id: string;
  title: string;
  description?: string;
  price: number;
  // ... other course fields
};