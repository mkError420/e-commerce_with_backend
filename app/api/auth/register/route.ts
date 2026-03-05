import { NextRequest } from 'next/server'
import { registerUser } from '@/lib/auth-unified'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName } = body
    
    if (!email || !password || !firstName || !lastName) {
      return apiError('All fields are required', 400)
    }
    
    if (password.length < 8) {
      return apiError('Password must be at least 8 characters', 400)
    }
    
    const result = await registerUser({ email, password, firstName, lastName })
    if (!result) {
      return apiError('Registration failed or user already exists', 400)
    }
    
    return apiSuccess({ 
      message: 'Registration successful',
      user: result.user,
      token: result.token 
    })
  } catch {
    return apiError('Registration failed', 500)
  }
}
