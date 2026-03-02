import { logoutAdmin } from '@/lib/auth-simple'
import { apiSuccess } from '@/lib/api-response'

export async function POST() {
  await logoutAdmin()
  return apiSuccess({ message: 'Logged out' })
}
