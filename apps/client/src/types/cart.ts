import { Course } from "./course";

export interface CartItem {
  id: string;
  cartId?: string;
  courseId?: string;
  course: Course;
  quantity: number;
  createdAt: string;
}


export interface Cart {
  id: string;      
  studentId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}