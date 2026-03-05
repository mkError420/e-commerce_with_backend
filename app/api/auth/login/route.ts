import { NextRequest } from 'next/server'
import { authenticateUser } from '@/lib/auth-unified'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body
    
    if (!email || !password) {
      return apiError('Email and password required', 400)
    }
    
    const result = await authenticateUser(email, password)
    if (!result) {
      return apiError('Invalid credentials', 401)
    }
    
    return apiSuccess({ 
      message: 'Login successful',
      user: result.user,
      token: result.token 
    })
  } catch {
    return apiError('Login failed', 500)
  }
}
