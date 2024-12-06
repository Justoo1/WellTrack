import Contributions from '@/components/admin/Contributions'
import QuickActions from '@/components/admin/QuickActions'
import { fetchContributions } from '@/lib/actions/contribution'

const ContributionPage = async () => {
    const data = await fetchContributions()

    if (!data.success) {
        return <div>Error: {data.error}</div>
    }
    else if (!data.contributions) {
        return <div>No users found</div>
    }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <QuickActions />
      <Contributions contributions={data.contributions} />
    </main>
  )
}

export default ContributionPage