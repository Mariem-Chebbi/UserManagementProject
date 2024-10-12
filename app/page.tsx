import Link from "next/link";
import {
  GithubSignInButton,
  GoogleSignInButton,
} from "@/app/components/authButtons";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/app/components/credentialsForm";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);
  console.log("Session: ", session);

  if (session) return redirect("/profilePage");
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-purple-500 to-blue-500 ">
      <div className="flex flex-col items-center mt-10 p-10 bg-white rounded-lg shadow-lg">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
        <CredentialsForm />
        <span className="text-2xl font-semibold text-black text-opacity-40 text-center mt-8">
          Or
        </span>
        <GoogleSignInButton />
        <GithubSignInButton />
        <span className="mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
}
