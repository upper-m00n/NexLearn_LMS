'use client'

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/axios/axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import RatingsStarsForUnEnrolled from "@/components/RatingsStarsForUnEnrolled";

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);

  const router= useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
        toast.success('Cart loaded successfully!');
        setCart(res.data.cart);
        console.log(res.data.cart);
      } catch (error) {
        console.log("Error while fetching cart", error);
        toast.error("Error while loading cart");
      }
    };
    fetchCart();
  }, [user]);

  const handleDeleteItem= async(courseId: string)=>{
    try {
        const studentId= user?.id;
        console.log("Course id:",courseId)
        const res= await axios.delete(`${BASE_URL}/api/cart/delete/${courseId}`,{
            params:{
                studentId
            }
        });
        toast.success("Item removed from cart!");

        setCart((prevCart: any)=>({
            ...prevCart,
            items: prevCart.items.filter((item:any)=> item.course.id !== courseId)
        }))
    } catch (error) {
        console.log("Error while removing cart item",error);
        toast.error("Failed to remove from cart!");
    }

  }

  if (!cart) return <p>Loading cart...</p>;

  const totalItems = cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const totalPrice = cart.items?.reduce((sum: number, item: any) => sum + item.quantity * item.course.price, 0) || 0;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="bg-black text-white p-6 rounded-md mb-6 shadow-md">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="mt-2 text-gray-300">Total Items: {totalItems}</p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-6">
          {cart.items && cart.items.length > 0 ? (
            cart.items.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <img
                    src={item.course.thumbnail}
                    alt={item.course.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">{item.course.title}</h2>
                  <p className="text-gray-700">Price: Rs {item.course.price}</p>
                  <RatingsStarsForUnEnrolled totalRating={parseFloat(item.course.rating)}/>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>

                <div className="flex flex-col gap-2 md:justify-end md:items-end">
                  <Button variant="destructive" className="w-full md:w-auto" onClick={()=>handleDeleteItem(item.course.id)}>
                    Remove
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    Add to wishlist
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          )}
        </div>

        {/* Summary Section */}
        <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Price:</span>
            <span>Rs {totalPrice}</span>
          </div>
          <Button className="w-full mt-4" onClick={()=>(router.push('/student/checkout'))}>Proceed to Checkout</Button>
          <p className="text-gray-500 text-sm mt-2">You won’t be charged yet.</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example recommendation cards */}
          <div className="p-4 bg-white rounded-lg shadow-md">Recommendation 1</div>
          <div className="p-4 bg-white rounded-lg shadow-md">Recommendation 2</div>
          <div className="p-4 bg-white rounded-lg shadow-md">Recommendation 3</div>
        </div>
      </div>
    </div>
  );
}
