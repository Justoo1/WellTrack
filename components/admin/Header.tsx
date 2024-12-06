import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-6">
        <div className="flex justify-between items-center">
        <Link href="/admin" className="text-blue-600 hover:underline">Admin Dashboard</Link>
        <h1 className="text-2xl font-semibold text-gray-800">Employee Welfare</h1>
        <UserButton />
        </div>
      </header>
    )
  }
  
  