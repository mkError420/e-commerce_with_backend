import { getAuthUser } from '@/lib/auth'
import { apiSuccess, apiUnauthorized } from '@/lib/api-response'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return apiUnauthorized()
  return apiSuccess({ user: { id: user.userId, email: user.email, role: user.role } })
}
