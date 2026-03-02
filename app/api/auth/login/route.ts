import { NextRequest } from 'next/server'
import { loginAdmin } from '@/lib/auth-simple'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return apiError('Email and password required', 400)
    const result = await loginAdmin(email, password)
    if (!result) return apiError('Invalid credentials', 401)
    return apiSuccess({ token: result.token, email })
  } catch {
    return apiError('Login failed', 500)
  }
}
