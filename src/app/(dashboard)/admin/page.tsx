import { ModerationPanel } from '@/components/admin/ModerationPanel'
import { AuditLogTable } from '@/components/admin/AuditLogTable'

export default function AdminPage() {
  return (
    <div className="px-4 sm:px-0 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <ModerationPanel />
      <AuditLogTable />
    </div>
  )
}
