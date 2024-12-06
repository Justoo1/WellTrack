import UsercardDetail from '@/components/shared/UsercardDetail'
import { fetchUserWithContributions } from '@/lib/actions/users.action'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const Dashboard = async () => {
  const { userId } = await auth()

  if(!userId) {
    redirect('/sign-in')
  }

  const userInfo = await fetchUserWithContributions(userId)
  return (
    <div className="min-h-screen  ">
      {/* Main Content */}
      {userInfo.success ? <UsercardDetail userData={userInfo.user!} /> :  userInfo.error && <div>{userInfo.error}</div>}
    </div>
  )
}

export default Dashboard