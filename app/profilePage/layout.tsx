import Navbar from "@/app/components/Navbar";
import prisma from "@/lib/prisma";

export default async function Layout({ children }: { children: any }) {
  return (
    <main
      style={{ backgroundColor: "#a755f7" }}
      className="flex w-full justify-center items-center"
    >
      <Navbar />
      <div className="flex flex-col w-full justify-center items-center">
        {children}
      </div>
    </main>
  );
}
