'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = () => {
    setLoading(true)
    api.blog.list().then(setPosts).finally(() => setLoading(false))
  }

  useEffect(() => { 
    fetchPosts()
    
    // Add event listener for page visibility changes to refresh when returning from edit page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPosts()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await api.blog.delete(id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Blog Posts</h2>
        <Link href="/dashboard/blog/new" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" /> Add Post
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Image</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Published</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Featured</th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">{post.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {post.category || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {post.authorName || 'Admin'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    <div>{new Date(post.updatedAt || post.publishedAt || post.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(post.updatedAt || post.publishedAt || post.createdAt).toLocaleTimeString()}</div>
                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                      <div className="text-xs text-green-600 font-medium">Updated</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.featured && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link 
                        href={`/dashboard/blog/${post.id}`} 
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 text-sm font-medium"
                        title="Edit Post"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id, post.title)} 
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 text-sm font-medium"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">Create your first blog post to get started</p>
            <Link 
              href="/dashboard/blog/new" 
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" /> Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
