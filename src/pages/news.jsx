import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import NewsCard from '../components/NewsCard/NewsCard'

// Mock news data - reused for all sections
const MOCK_NEWS = [
  { id: 1, headline: 'Tech Giants Announce Major Hiring Spree for AI Engineers', company: 'TechCorp', postedTime: '2 hours ago' },
  { id: 2, headline: 'New Remote Work Policies Boost Job Applications by 40%', company: 'GlobalTech', postedTime: '3 hours ago' },
  { id: 3, headline: 'Startup Ecosystem Sees Record Growth in Q1 2025', company: 'Innovate Inc', postedTime: '5 hours ago' },
  { id: 4, headline: 'Major Banks Expanding Technology Teams Nationwide', company: 'FinanceHub', postedTime: '6 hours ago' },
  { id: 5, headline: 'Healthcare Industry Creates 10,000 New Positions', company: 'MedCare', postedTime: '8 hours ago' },
  { id: 6, headline: 'E-commerce Companies Hiring for Holiday Season', company: 'ShopMax', postedTime: '10 hours ago' },
  { id: 7, headline: 'Cybersecurity Firms Struggle to Fill Open Positions', company: 'SecureNet', postedTime: '12 hours ago' },
  { id: 8, headline: 'Green Energy Sector Announces Expansion Plans', company: 'EcoPower', postedTime: '1 day ago' },
  { id: 9, headline: 'Software Development Bootcamps Partner with Top Employers', company: 'CodeAcademy', postedTime: '1 day ago' },
  { id: 10, headline: 'AI-Powered Recruitment Tools Transform Hiring Process', company: 'HireAI', postedTime: '2 days ago' },
  { id: 11, headline: 'Major Retail Chains Expanding Digital Teams', company: 'RetailPlus', postedTime: '2 days ago' },
  { id: 12, headline: 'Cloud Computing Demand Drives Engineer Shortage', company: 'CloudTech', postedTime: '3 days ago' },
]

function NewsSection({ title, icon, newsItems }) {
  const [showAll, setShowAll] = useState(false)
  const displayedNews = showAll ? newsItems : newsItems.slice(0, 6)

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-[1.5rem] font-bold text-slate-900">{title}</h2>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {displayedNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
      
      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full py-3 px-6 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
      >
        {showAll ? 'Show Less' : 'Show More'}
      </button>
    </section>
  )
}

function News() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
        <h1 className="text-[2rem] font-bold text-slate-900 mb-8">News</h1>
        
        {/* Latest News Section */}
        <NewsSection 
          title="Latest News" 
          newsItems={MOCK_NEWS} 
        />
        
        {/* Hot News Section */}
        <NewsSection 
          title="Hot News" 
          icon="🔥"
          newsItems={MOCK_NEWS} 
        />
        
        {/* Big Company News Section */}
        <NewsSection 
          title="Big Company News" 
          icon="🏢"
          newsItems={MOCK_NEWS.map(news => ({ ...news, company: `Big ${news.company}` }))} 
        />
      </main>
      
      <Footer />
    </div>
  )
}

export default News
