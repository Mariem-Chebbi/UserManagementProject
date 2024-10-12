import { authConfig, loginIsRequiredServer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { EditProfileForm } from "../components/editProfile";

const wait = (ms: number) => new Promise((rs) => setTimeout(rs, ms));

export default async function Page() {
  await loginIsRequiredServer();

  const session = await getServerSession(authConfig);

  // Ensure session.user.email is defined
  const userEmail = session?.user?.email;

  if (!userEmail) {
    // Handle the case where userEmail is null or undefined
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 py-6">
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Error: User not found
          </h1>
          <p className="text-gray-700">User session is not valid.</p>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail }, // userEmail is now definitely a string
  });

  await wait(1000);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 py-6">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Edit Profile
        </h1>
        {session?.user?.image && (
          <img
            className="h-40 w-40 rounded-full mb-4 shadow-md border-4 border-gray-300"
            src={session?.user?.image}
            alt="Profile Picture"
          />
        )}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {session?.user?.name}
        </h3>
        <EditProfileForm user={user} />
      </div>
    </div>
  );
}
