"use client";

import { BASE_URL } from "@/axios/axios";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutButton = () => {

  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const router= useRouter();

// load cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
        setCart(res.data.cart);
      } catch (error) {
        console.error("Error while fetching cart", error);
        toast.error("Error while loading cart");
      }
    };
    fetchCart();
  }, [user]);

  
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (document.querySelector("#razorpay-sdk")) {
        return resolve(true); 
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!cart) return;
    setLoading(true);

    const totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.course.price,
      0
    );

    try {
      const res = await axios.post(`${BASE_URL}/api/payment/create-order`, {
        studentId: user?.id,
        totalAmount,
        cartItems: cart.items,
      });

      const { razorpayOrder } = res.data;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your connection.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "NexLearn",
        description: "Course Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          await axios.post(`${BASE_URL}/api/payment/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            studentEmail:user?.email,
            cartItems:cart.items,
          });

          toast.success("Payment successful!");
        },
        prefill: {
          email: user?.email || "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      router.push('/student/my-courses')

      
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart?.items?.reduce(
    (sum: number, item: any) => sum + item.course.price,
    0
  );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-25">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {!cart ? (
        <p className="text-gray-600">Loading your cart...</p>
      ) : cart.items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-2 text-sm"
            >
              <span>{item.course.title}</span>
              <span>₹{item.course.price}</span>
            </div>
          ))}

          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutButton;
