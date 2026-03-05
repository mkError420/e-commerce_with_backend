import { createToken, setAuthCookie, removeAuthCookie } from './auth'

// In a real app, you'd have a database of users
// For now, we'll use a simple in-memory store for demo
const users: Array<{
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
}> = [
  {
    id: 'user-1',
    email: 'user@example.com',
    password: 'password123', // In production, this would be hashed
    firstName: 'John',
    lastName: 'Doe',
    role: 'user'
  },
  {
    id: 'user-2',
    email: 'test@test.com',
    password: 'test123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user'
  }
]

export async function loginUser(email: string, password: string): Promise<{ token: string; user: any } | null> {
  // Find user by email
  const user = users.find(u => u.email === email)
  
  if (!user) {
    return null
  }
  
  // Check password (in production, use bcrypt.compare)
  if (user.password !== password) {
    return null
  }
  
  // Create JWT token
  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })
  
  // Set auth cookie
  await setAuthCookie(token)
  
  // Return user data without password
  const { password: _, ...userData } = user
  return { 
    token, 
    user: userData 
  }
}

export async function registerUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<{ token: string; user: any } | null> {
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email)
  if (existingUser) {
    return null
  }
  
  // Create new user (in production, save to database)
  const newUser = {
    id: `user-${Date.now()}`,
    email: userData.email,
    password: userData.password, // In production, hash this
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: 'user'
  }
  
  // Add to our "database" (for demo only)
  users.push(newUser)
  
  // Create JWT token
  const token = await createToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  })
  
  // Set auth cookie
  await setAuthCookie(token)
  
  // Return user data without password
  const { password: _, ...userResponse } = newUser
  return { 
    token, 
    user: userResponse 
  }
}

export async function logoutUser() {
  await removeAuthCookie()
}
