"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CredentialsFormProps {
  csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      //Redirect to homepage (/timeline)
      router.push("/profilePage");
    } else {
      console.log("Error: ", signInResponse);
      setError("Your Email or Password is wrong!");
    }
  };

  return (
    <form className="w-full mt-8 text-xl flex flex-col" onSubmit={handleSubmit}>
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="mb-2 p-2 border rounded-lg"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="mb-2 p-2 border rounded-lg"
      />

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white hover:bg-blue-700 rounded-lg"
      >
        Log in
      </button>
    </form>
  );
}
