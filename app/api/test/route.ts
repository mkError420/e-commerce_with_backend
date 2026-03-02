import { NextRequest } from 'next/server'

export async function GET() {
  console.log('Test API GET called')
  return Response.json({ message: 'Test API working', timestamp: Date.now() })
}

export async function POST(req: NextRequest) {
  console.log('Test API POST called')
  try {
    const body = await req.json()
    console.log('Test API received body:', body)
    return Response.json({ success: true, data: body, timestamp: Date.now() })
  } catch (error) {
    console.error('Test API error:', error)
    return Response.json({ error: 'Test API failed' }, { status: 500 })
  }
}
