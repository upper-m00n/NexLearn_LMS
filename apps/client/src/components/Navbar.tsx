'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { use, useState } from "react";

const Navbar = () => {
  // Assuming your context provides a logout function
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [query,setQuery]=useState('');

  const handleLogout = () => {
    logout();
    router.push('/login'); // Redirect to login page after logout
  };
  
  const handleProfileView=()=>{
    if(user?.role==='STUDENT'){
      router.push('/student/profile')
    }
    else{
      router.push('/trainer/profile')
    }
  }

  const handleInputChange=async(event:React.ChangeEvent<HTMLInputElement>)=>{
    setQuery(event.target.value);
  }

  const handleSearchSubmit= (event:React.FormEvent)=>{
    event.preventDefault();

    if(!query.trim()) return;

    router.push(`/search?q=${query}`);
  }

  return (
    <nav className="bg-black text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href='/' className="text-2xl font-bold text-white">
          NexLearn
        </Link>

        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-2xl mx-4">
          <Input 
          type="text" 
          className="max-w-2xl" 
          placeholder="Search by title, instructor, or category..."
          value={query}
          onChange={handleInputChange}
          />
        </form>
  
        <div className="flex items-center gap-6 text-sm font-medium">
          {user && token ? (
            // --- Logged-in User View ---
            <>
              <Link href="/explore" className="hover:text-gray-300 transition-colors">
                Explore
              </Link>
              <Link href="/student/cart" className="hover:text-gray-300 transition-colors text-2xl">
                <FiShoppingCart/>
              </Link>

              {
                user.role==="STUDENT"?
                (<Link href="/student/my-courses" className="hover:text-gray-300 transition-colors">
                  My Courses
                </Link>):(
                <Link href="/trainer" className="hover:text-gray-300 transition-colors">
                  Create Course
                </Link>
              )
              }
              

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user.profilePic as string || "https://github.com/shadcn.png"} />
                    <AvatarFallback>{user.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Welcome</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileView}>Profile</DropdownMenuItem>
                  {user.role === 'TRAINER' && (
                    <DropdownMenuItem onClick={() => router.push('/trainer')}>
                      Trainer Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/explore" className="hover:text-gray-300 transition-colors">
                Explore
              </Link>
              <Link href="/login">
                <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;