import Employees from "@/components/admin/Employees"
import QuickActions from "@/components/admin/QuickActions"
import { fetchUsers } from "@/lib/actions/users.action"


const EmployeesPage = async() => {
  const employees = await fetchUsers()
  if (!employees.success) {
    return <div>Error: {employees.error}</div>
  }else if(!employees.users){
    return <div>No users found</div>
  }
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <QuickActions />
      <Employees employees={employees.users} />
    </main>
  )
}

export default EmployeesPage
