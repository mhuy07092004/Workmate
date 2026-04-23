import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import PostCard from '../components/PostCard/PostCard.jsx'
import Contact from '../components/Contact/Contact.jsx'

// Sample posts data - will be replaced by backend later
const SAMPLE_POSTS = [
  {
    id: 1,
    author: 'Jane Smith',
    timestamp: '2 hours ago',
    content: 'Just finished an amazing project! Really proud of what our team accomplished this quarter. Looking forward to the next challenge. 🚀',
    likes: 24,
    comments: 5
  },
  {
    id: 2,
    author: 'Mike Johnson',
    timestamp: '5 hours ago',
    content: 'Beautiful day at the office! Check out this view from our new workspace.',
    image: 'https://reformark.se/wp-content/uploads/2022/01/Mojang_JStrongPhoto_web_01.jpg',
    likes: 56,
    comments: 12
  },
  {
    id: 3,
    author: 'Sarah Chen',
    timestamp: '1 day ago',
    content: 'Hiring alert! We are looking for talented software engineers to join our growing team. DM me if you are interested or know someone who might be a good fit.',
    likes: 38,
    comments: 8
  }
]

function Post() {
  const [postText, setPostText] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-8 pb-16 px-4 max-w-[1400px] mx-auto flex gap-6 items-start">
        {/* Left sidebar - Contact (sticky) */}
        <Contact />

        {/* Middle column - Posts feed */}
        <div className="flex-1 max-w-[640px] mx-auto">
          {/* Create Post Section */}
          <section className="bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] mb-6">
            <div className="flex gap-3">
              {/* User Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                Y
              </div>

              {/* Text Input Area */}
              <div className="flex-1">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="What do you think today?"
                  className="w-full min-h-[80px] p-3 text-[0.95rem] text-slate-700 bg-slate-50 rounded-[10px] border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3">
                  {/* Picture Icon */}
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 text-[0.875rem] text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-[8px] transition-colors"
                    title="Add picture (coming soon)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15,16 10,5 21"/>
                    </svg>
                    <span>Picture</span>
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[0.875rem] font-medium rounded-[8px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!postText.trim()}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9"/>
                    </svg>
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Posts Feed */}
          <section className="space-y-4">
            {SAMPLE_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        </div>

        {/* Right column - Empty placeholder */}
        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default Post