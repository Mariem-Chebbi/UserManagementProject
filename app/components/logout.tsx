import { signOut } from "next-auth/react";

function LogoutButton() {
  return (
    <button
      className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200"
      onClick={() => signOut()} // Redirect after logout
    >
      Logout
    </button>
  );
}

export default LogoutButton;
