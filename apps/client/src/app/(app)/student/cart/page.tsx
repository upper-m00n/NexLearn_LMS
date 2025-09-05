'use client'

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/axios/axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import RatingsStarsForUnEnrolled from "@/components/RatingsStarsForUnEnrolled";
import { Cart, CartItem } from "@/types/cart";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
        setCart(res.data.cart);
      } catch (error) {
        console.log("Error while fetching cart", error);
          toast.error("Error while loading cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const handleDeleteItem = async (courseId: string) => {
    if (!user?.id) return;
    try {
      await axios.delete(`${BASE_URL}/api/cart/delete/${courseId}`, {
        params: { studentId: user.id }
      });
      toast.success("Item removed from cart!");

      setCart((prevCart) => {
        if (!prevCart) return null;
        return {
          ...prevCart,
          items: prevCart.items.filter((item) => item.course.id !== courseId),
        };
      });
    } catch (error) {
      console.log("Error while removing cart item", error);
      toast.error("Failed to remove from cart!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  const totalItems = cart?.items?.reduce((sum, item: CartItem) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((sum, item: CartItem) => sum + (item.quantity * item.course.price), 0) || 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black text-white p-6 rounded-lg mb-6 shadow-md">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {totalItems > 0 && <p className="mt-2 text-gray-300">{totalItems} course(s) in your cart</p>}
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            {cart && cart.items.length > 0 ? (
              cart.items.map((item: CartItem) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-full md:w-40 h-32 flex-shrink-0">
                    <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h2 className="text-xl font-semibold">{item.course.title}</h2>
                    <p className="text-gray-700 font-bold">₹{item.course.price}</p>
                    <RatingsStarsForUnEnrolled totalRating={item.course.rating ?? 0}/>
                  </div>
                  <div className="flex flex-col gap-2 self-stretch md:self-center">
                    <Button variant="destructive" onClick={() => handleDeleteItem(item.course.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
                    <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/courses">Keep Shopping</Link>
                    </Button>
                </div>
            )}
          </div>
          
          {cart && cart.items.length > 0 && (
            <div className="w-full lg:w-1/3 p-6 bg-white rounded-lg shadow-sm self-start">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <Separator/>
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push('/student/checkout')}>
                Proceed to Checkout
              </Button>
              <p className="text-gray-500 text-xs text-center mt-2">You won’t be charged yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}