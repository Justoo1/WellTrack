// import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ProfileMenu from "../shared/ProfileMenu";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetchUserWithContributions } from "@/lib/actions/users.action";

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    return redirect('/sign-in')
  }

  const userInfo = await fetchUserWithContributions(session.user.email)
  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
      <Link href="/admin" className="text-blue-600 hover:underline">Admin Dashboard</Link>
      <Link href="/" className="text-blue-600 hover:underline">Home</Link>
      <h1 className="text-2xl font-semibold text-gray-800">Employee Welfare</h1>
      {userInfo.success && userInfo.user && <ProfileMenu user={userInfo.user} />}
      </div>
    </header>
  )
}
 
export default Header;
  