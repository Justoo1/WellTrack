import Expenses from '@/components/admin/Expenses'
import QuickActions from '@/components/admin/QuickActions'
import { fetchExpenses } from '@/lib/actions/expenses'

const ExpensesPage = async () => {
    const data = await fetchExpenses()

    if (!data.success) {
        return <div>Error: {data.error}</div>
    }
    else if (!data.expenses) {
        return <div>No users found</div>
    }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <Expenses expenses={data.expenses!} />
        <QuickActions />
    </main>
  )
}

export default ExpensesPage