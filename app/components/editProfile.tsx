"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateAddress } from "../../lib/validateAddress";

export const EditProfileForm = ({ user }) => {
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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");

      if (user.birthdate) {
        if (user.birthdate instanceof Date) {
          setBirthdate(user.birthdate.toISOString().split("T")[0]);
        } else if (typeof user.birthdate === "string") {
          setBirthdate(user.birthdate.split("T")[0]);
        } else {
          setBirthdate("");
        }
      }

      setEmail(user.email || "");
      setAddress(user.address || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const isValidAddress = await validateAddress(address);
    if (!isValidAddress) {
      alert("The address must be within 50 km of Paris.");
      setError("The address must be within 50 km of Paris.");
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          birthdate,
          email,
          address,
          phone,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (success) {
      router.push("/profilePage");
    }
  }, [success, router]);

  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 text-xl flex flex-col">
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
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
        Save
      </button>

      {success && (
        <p className="text-green-500 mt-2">User updated successfully!</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};
