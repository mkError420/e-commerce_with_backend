import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'mkshopbd-secret-key'
const COOKIE_NAME = 'admin_token'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  exp: number
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8')
}

export async function createToken(payload: Omit<JWTPayload, 'exp'>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const data = { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }
  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(data))
  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url')
  return `${headerB64}.${payloadB64}.${signature}`
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [headerB64, payloadB64, signature] = parts
    const expectedSig = createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url')
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as JWTPayload
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
