import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, status = 200) {
  console.log('apiSuccess called with data:', data, 'status:', status)
  const response = NextResponse.json({ success: true, data }, { status })
  console.log('apiSuccess response:', response)
  return response
}

export function apiError(message: string, status = 400) {
  console.log('apiError called with message:', message, 'status:', status)
  const response = NextResponse.json({ success: false, error: message }, { status })
  console.log('apiError response:', response)
  return response
}

export function apiUnauthorized() {
  return apiError('Unauthorized', 401)
}
