/**
 * news_information.jsx — News Information/Article page
 *
 * Features:
 *   - Navbar and Footer layout
 *   - News headline with company and posted by user info
 *   - Featured image and detailed news content
 *   - Uses route param :id for dynamic routing
 */
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import NewsTitle from '../components/NewsDescription/NewsTitle.jsx'
import NewsDetails from '../components/NewsDescription/NewsDetails.jsx'

// Mock data for news information (single news item)
const MOCK_NEWS_DATA = {
  id: 1,
  title: 'ParkIT Just Hired 20 Fresher Software Engineers!',
  company: 'ParkIT',
  postedBy: 'Hayden Loi',
  postedDate: '2025-04-23',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop',
  content: `ParkIT, the innovative parking solutions startup, has announced a major hiring spree, bringing on board 20 fresh software engineering graduates to support its rapid expansion across Australia.

The new hires will join ParkIT's Sydney headquarters and will be distributed across multiple teams including mobile development, backend infrastructure, and data analytics. This marks the company's largest graduate recruitment drive to date.

"We are thrilled to welcome these talented young engineers to our team," said Sarah Chen, CTO of ParkIT. "As we scale our operations to meet growing demand, fresh perspectives and innovative thinking from recent graduates will be invaluable to our success."

The recruitment initiative comes on the heels of ParkIT securing $5 million in Series A funding earlier this year. The company plans to expand its services to Melbourne, Brisbane, and Perth within the next 18 months.

All 20 new engineers have completed intensive onboarding training and will begin working on real projects immediately. The company has committed to providing mentorship programs and professional development opportunities to help accelerate their career growth.

This hiring announcement signals strong growth in Australia's tech sector and reflects increasing demand for parking technology solutions in urban centers across the country.`,
}

function NewsInformation() {
  const { id } = useParams()

  // In a real app, fetch news data based on id
  // For now, using mock data
  const news = MOCK_NEWS_DATA

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8">
        {/* News Title Section */}
        <NewsTitle
          title={news.title}
          company={news.company}
          postedBy={news.postedBy}
          postedDate={news.postedDate}
        />

        {/* News Details Section */}
        <div className="mt-6">
          <NewsDetails
            content={news.content}
            image={news.image}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NewsInformation
