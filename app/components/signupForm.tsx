"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateAddress } from "@/lib/validateAddress";

export const SignupForm = () => {
  const router = useRouter();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordValid(false);
      return;
    }

    const isValidAddress = await validateAddress(address);
    if (!isValidAddress) {
      alert("The address must be within 50 km of Paris.");
      setError("The address must be within 50 km of Paris.");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          address,
          birthdate,
          phone,
          email,
          password,
        }),
      });

      console.log("Response:", res);
      const data = await res.json();
      console.log("Data:", data);
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to create user.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (success) {
      router.push("/profilePage");
    }
  }, [success]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>-_']/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  return (
    <div className="card-container" style={{ width: "400px", margin: "auto" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-8 text-xl flex flex-col"
      >
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="mb-2 p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="mb-2 p-2 border rounded-lg"
        />
        <input
          type="date"
          placeholder="Birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
          className="mb-2 p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mb-2 p-2 border rounded-lg"
        />
        <p className="text-sm text-gray-500">
          The address must be within 50 km of Paris.
        </p>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          minLength={8}
          pattern="^\+?\d{7,}$"
          className="mb-2 p-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-2 p-2 border rounded-lg"
        />
        <div className="relative mb-2">
          <input
            type={passwordVisible ? "text" : "password"} // Toggle input type
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordValid(true);
            }}
            required
            className="p-2 border rounded-lg w-full"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {passwordVisible ? (
              <span role="img" aria-label="Hide password">
                🙈
              </span>
            ) : (
              <span role="img" aria-label="Show password">
                👁️
              </span>
            )}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "40px",
          }}
        >
          {!passwordValid && (
            <p className="text-red-500">
              Password must be at least 8 characters long and include uppercase,
              lowercase, numbers, and special characters.
            </p>
          )}
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
          Sign Up
        </button>

        {success && (
          <p className="text-green-500 mt-2">User created successfully!</p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};
