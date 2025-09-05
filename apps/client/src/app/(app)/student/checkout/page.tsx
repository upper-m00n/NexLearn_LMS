"use client";

import { BASE_URL } from "@/axios/axios";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Cart, CartItem } from "@/types/cart"; 
import { Loader2 } from "lucide-react";
import { RazorpayOptions, RazorpayResponse } from "@/types/Razorpay";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void; };
  }
}

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  const router = useRouter();

  // Load cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
          setCartLoading(false);
          return;
      };
      setCartLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
        setCart(res.data.cart);
      } catch (error) {
        console.error("Error while fetching cart", error);
        toast.error("Error while loading cart");
      } finally {
        setCartLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-sdk")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!cart || !user) return;
    setLoading(true);


    const totalAmount = cart.items.reduce(
      (sum: number, item: CartItem) => sum + item.course.price, 0
    );

    try {
      const res = await axios.post(`${BASE_URL}/api/payment/create-order`, {
        studentId: user.id,
        totalAmount,
        cartItems: cart.items,
      });

      const { razorpayOrder } = res.data;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load payment gateway. Please check your connection.");
        setLoading(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "NexLearn",
        description: "Course Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response: RazorpayResponse) {
          try {
            await axios.post(`${BASE_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentEmail: user.email,
              cartItems: cart.items,
            });

            toast.success("Payment successful! Redirecting to your courses...");
            router.push('/student/my-courses');
            
          } catch (verifyError) {
             console.error("Payment verification failed:", verifyError);
             toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#4F46E5" }, 
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart?.items?.reduce(
    (sum: number, item: CartItem) => sum + item.course.price, 0
  );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

      {cartLoading ? (
         <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600"/>
         </div>
      ) : !cart || cart.items.length === 0 ? (
        <p className="text-gray-600 text-center py-10">Your cart is empty</p>
      ) : (
        <div className="space-y-3">

          {cart.items.map((item: CartItem) => (
            <div key={item.id} className="flex justify-between border-b pb-2 text-sm text-gray-600">
              <span className="flex-1 truncate pr-4">{item.course.title}</span>
              <span className="font-medium text-gray-800">₹{item.course.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg pt-4">
            <span>Total:</span>
            <span>₹{totalAmount?.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;