import { getAuthUser } from '@/lib/auth'
import { apiSuccess, apiUnauthorized } from '@/lib/api-response'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return apiUnauthorized()
  
  // Return user data with all fields
  return apiSuccess({ 
    user: { 
      id: user.userId, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName || 'User',
      lastName: user.lastName || ''
    } 
  })
}
