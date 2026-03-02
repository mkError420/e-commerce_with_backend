import { NextRequest } from 'next/server'

export async function GET() {
  try {
    return Response.json({ message: 'Banners API working', timestamp: Date.now() })
  } catch (error) {
    return Response.json({ error: 'Failed to get banners' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST banners API called')
    const body = await req.json()
    console.log('Received body:', body)
    
    const { title, subtitle, description, image, category, backgroundColor, gradient, isActive, position } = body
    
    // Validate required fields
    if (!title || !subtitle || !description) {
      return Response.json({ 
        error: 'Title, subtitle, and description are required' 
      }, { status: 400 })
    }
    
    // Validate image URL
    if (!image) {
      return Response.json({ 
        error: 'Image URL is required' 
      }, { status: 400 })
    }
    
    // Basic URL validation
    try {
      new URL(image)
    } catch {
      // If it's not a valid URL, check if it's a local path
      if (!image.startsWith('/')) {
        return Response.json({ 
          error: 'Image URL must be a valid URL or start with /' 
        }, { status: 400 })
      }
    }
    
    return Response.json({ 
      success: true, 
      data: {
        id: Date.now().toString(),
        title,
        subtitle,
        description,
        image,
        category: category || '',
        backgroundColor: backgroundColor || 'from-shop_dark_green',
        gradient: gradient || 'to-shop_light_green',
        isActive: isActive !== false,
        position: position || 0
      }, 
      message: 'Banner created successfully',
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('POST banners error:', error)
    return Response.json({ 
      error: 'Failed to create banner',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('PUT banners API called with:', body)
    
    return Response.json({ 
      success: true, 
      data: body, 
      message: 'Banner updated successfully',
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('PUT banners error:', error)
    return Response.json({ 
      error: 'Failed to update banner',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    console.log('DELETE banners API called for id:', id)
    
    return Response.json({ 
      success: true, 
      message: 'Banner deleted successfully',
      id: id,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('DELETE banners error:', error)
    return Response.json({ 
      error: 'Failed to delete banner',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
