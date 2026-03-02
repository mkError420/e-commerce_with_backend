import { createToken, setAuthCookie, removeAuthCookie } from './auth'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mkshopbd.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function loginAdmin(email: string, password: string): Promise<{ token: string } | null> {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = await createToken({
      userId: 'admin-1',
      email: ADMIN_EMAIL,
      role: 'admin'
    })
    await setAuthCookie(token)
    return { token }
  }
  return null
}

export async function logoutAdmin() {
  await removeAuthCookie()
}
