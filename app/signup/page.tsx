"use client";
import { SignupForm } from "@/app/components/signupForm"; // Adjust the import path if needed

export default function SignupPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-purple-500 to-blue-500 ">
      <div className="flex flex-col items-center mt-10 p-10 bg-white rounded-lg shadow-lg">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign Up</h1>
        <SignupForm />
      </div>
    </div>
  );
}
