/**
 * dashboard.jsx — Main dashboard (root route)
 *
 * Accessible to all users. The Navbar conditionally shows a user icon
 * (signed in) or a "Join Now" button (signed out) based on localStorage.
 *
 * Planned sections (to be built out):
 *   - Recommendation: personalised job/talent suggestions from the matching engine
 *   - Applications:   candidate application tracker / employer applicant list
 *   - Help:           support articles and contact options
 *
 * TODO (backend integration):
 *   - Read the current user from AuthContext (or equivalent) to personalise the greeting
 *   - Fetch recommendation and application data from the API on mount
 */
import { useState } from 'react'
import Footer from '../components/Footer/Footer.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import NewsCard from '../components/NewsCard/NewsCard.jsx'
import Contact from '../components/Contact/Contact.jsx'
import Post from '../components/Posts/Post.jsx'
import Showmore from '../components/Button/Showmore.jsx'

// Mock job data
const MOCK_JOBS = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: 'Fresher Frontend Developer',
  company: 'Workmate Solutions',
  type: 'Part Time',
  location: 'Sydney, NSW',
  postedTime: 'Posted 3 weeks ago'
}))

// Mock posts data
const MOCK_POSTS = [
  {
    id: 1,
    author: 'Jane Smith',
    timestamp: '2 hours ago',
    content: 'Just finished an amazing project! Really proud of what our team accomplished this quarter. 🚀',
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
    content: 'Hiring alert! Looking for talented software engineers to join our growing team. DM me if interested.',
    likes: 38,
    comments: 8
  },
  {
    id: 4,
    author: 'David Park',
    timestamp: '2 days ago',
    content: 'Excited to share that I just got promoted to Senior Developer! Hard work pays off. 🎉',
    likes: 102,
    comments: 23
  }
]

const MOCK_NEWS = [
  {
    id: 1,
    headline: 'ParkIT Just Hired 20 Fresher Software Engineers!',
    company: 'ParkIT',
    postedTime: '2 hours ago'
  }
]

function Dashboard() {
  const [visibleJobs, setVisibleJobs] = useState(6)
  const [visibleNews, setVisibleNews] = useState(4)
  const [visiblePosts, setVisiblePosts] = useState(3)

  const handleShowMoreJobs = () => {
    setVisibleJobs(prev => Math.min(prev + 6, MOCK_JOBS.length))
  }

  const handleShowMoreNews = () => {
    setVisibleNews(prev => Math.min(prev + 4, MOCK_NEWS.length))
  }

  const handleShowMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 3, MOCK_POSTS.length))
  }

  const displayedJobs = MOCK_JOBS.slice(0, visibleJobs)
  const displayedNews = MOCK_NEWS.slice(0, visibleNews)
  const displayedPosts = MOCK_POSTS.slice(0, visiblePosts)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top navigation bar — shared across all authenticated pages */}
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        {/* Left sidebar - Contact (sticky) */}
        <Contact />

        {/* Middle column - Main content (scrollable) */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
        {/* Welcome banner */}
        <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <h1 className="mb-2.5 text-[1.6rem] text-slate-900">Welcome to Workmate Dashboard</h1>
          <p className="text-slate-600 leading-relaxed">
            You are signed in successfully. Use navigation above to browse recommendations,
            applications, and support resources.
          </p>
        </section>

        {/* Recommendation Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">Recommended Jobs</h2>
            <p className="text-slate-600">Personalized job recommendations based on your profile and preferences</p>
          </div>
          
          {/* Job cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {displayedJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {/* Show More/Show Less buttons */}
          <Showmore
            visibleCount={visibleJobs}
            totalCount={MOCK_JOBS.length}
            initialCount={6}
            onShowMore={handleShowMoreJobs}
            onShowLess={() => setVisibleJobs(6)}
          />
        </section>

        {/* Hiring News Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">Hiring News</h2>
            <p className="text-slate-600">Stay updated with the latest hiring trends and company news</p>
          </div>

          {/* News cards - single column layout */}
          <div className="space-y-4 mb-6">
            {displayedNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          {/* Show More/Show Less buttons */}
          <Showmore
            visibleCount={visibleNews}
            totalCount={MOCK_NEWS.length}
            initialCount={4}
            itemName="News"
            onShowMore={handleShowMoreNews}
            onShowLess={() => setVisibleNews(4)}
          />
        </section>

        {/* Posts Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">Posts</h2>
            <p className="text-slate-600">Connect with professionals and share insights</p>
          </div>
          <div className="space-y-4 mb-6">
            {displayedPosts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </div>

          {/* Show More/Show Less buttons */}
          <Showmore
            visibleCount={visiblePosts}
            totalCount={MOCK_POSTS.length}
            initialCount={3}
            itemName="Posts"
            onShowMore={handleShowMorePosts}
            onShowLess={() => setVisiblePosts(3)}
          />
        </section>
        </div>

        {/* Right column - Empty placeholder */}
        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
