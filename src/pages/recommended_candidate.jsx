/**
 * recommended_candidate.jsx — Recommended Candidates page (employer view)
 *
 * Features:
 *   - Advanced filter section for finding candidates
 *   - Three candidate recommendation sections with show more/less toggle
 *   - Layout with Contact sidebar, main content, and Footer
 */
import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Contact from '../components/Contact/Contact.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'
import CandidateFilter from '../components/FilterSection/CandidateFilter.jsx'

// Mock data for "Chosen By Workmate A.I" section
const AI_CHOSEN_CANDIDATES = [
  { id: 1, fullName: 'Sarah Chen', location: 'Sydney, NSW', jobApplied: 'Senior Software Engineer', experience: '5 years', degree: 'Bachelor', major: 'Computer Science' },
  { id: 2, fullName: 'Michael Johnson', location: 'Melbourne, VIC', jobApplied: 'Data Scientist', experience: '3 years', degree: 'Master', major: 'Data Science' },
  { id: 3, fullName: 'Emily Rodriguez', location: 'Sydney, NSW', jobApplied: 'Product Manager', experience: '4 years', degree: 'Bachelor', major: 'Business Administration' },
  { id: 4, fullName: 'David Kim', location: 'Brisbane, QLD', jobApplied: 'UX Designer', experience: '2 years', degree: 'Bachelor', major: 'Design' },
  { id: 5, fullName: 'Jessica Wang', location: 'Sydney, NSW', jobApplied: 'DevOps Engineer', experience: '6 years', degree: 'Master', major: 'Information Technology' },
  { id: 6, fullName: 'Alex Thompson', location: 'Melbourne, VIC', jobApplied: 'Frontend Developer', experience: '3 years', degree: 'Bachelor', major: 'Software Engineering' },
  { id: 7, fullName: 'Ryan Patel', location: 'Sydney, NSW', jobApplied: 'Backend Developer', experience: '4 years', degree: 'Master', major: 'Computer Science' },
  { id: 8, fullName: 'Sophie Anderson', location: 'Perth, WA', jobApplied: 'Cloud Architect', experience: '7 years', degree: 'Bachelor', major: 'Computer Engineering' },
  { id: 9, fullName: 'James Wilson', location: 'Melbourne, VIC', jobApplied: 'Mobile Developer', experience: '2 years', degree: 'Bachelor', major: 'Software Engineering' },
  { id: 10, fullName: 'Lisa Brown', location: 'Sydney, NSW', jobApplied: 'Security Engineer', experience: '5 years', degree: 'Master', major: 'Cybersecurity' },
  { id: 11, fullName: 'Daniel Lee', location: 'Brisbane, QLD', jobApplied: 'Full Stack Developer', experience: '4 years', degree: 'Bachelor', major: 'Computer Science' },
  { id: 12, fullName: 'Emma Davis', location: 'Sydney, NSW', jobApplied: 'QA Engineer', experience: '3 years', degree: 'Bachelor', major: 'Information Technology' },
]

// Mock data for "Based on Search History" section
const SEARCH_HISTORY_CANDIDATES = [
  { id: 101, fullName: 'Christopher Moore', location: 'Melbourne, VIC', jobApplied: 'React Developer', experience: '2 years', degree: 'Bachelor', major: 'Software Engineering' },
  { id: 102, fullName: 'Amanda Taylor', location: 'Sydney, NSW', jobApplied: 'Node.js Developer', experience: '4 years', degree: 'Master', major: 'Computer Science' },
  { id: 103, fullName: 'Matthew Clark', location: 'Brisbane, QLD', jobApplied: 'Python Developer', experience: '3 years', degree: 'Bachelor', major: 'Data Science' },
  { id: 104, fullName: 'Olivia White', location: 'Sydney, NSW', jobApplied: 'JavaScript Engineer', experience: '2 years', degree: 'Bachelor', major: 'Computer Science' },
  { id: 105, fullName: 'Andrew Hall', location: 'Melbourne, VIC', jobApplied: 'Vue.js Developer', experience: '3 years', degree: 'Diploma', major: 'Web Development' },
  { id: 106, fullName: 'Sophia Martinez', location: 'Perth, WA', jobApplied: 'TypeScript Developer', experience: '4 years', degree: 'Bachelor', major: 'Software Engineering' },
  { id: 107, fullName: 'Kevin Young', location: 'Sydney, NSW', jobApplied: 'Angular Developer', experience: '5 years', degree: 'Master', major: 'Computer Science' },
  { id: 108, fullName: 'Rachel Green', location: 'Melbourne, VIC', jobApplied: 'PHP Developer', experience: '3 years', degree: 'Bachelor', major: 'Information Technology' },
  { id: 109, fullName: 'Benjamin King', location: 'Brisbane, QLD', jobApplied: 'Ruby Developer', experience: '4 years', degree: 'Bachelor', major: 'Software Engineering' },
  { id: 110, fullName: 'Natalie Scott', location: 'Sydney, NSW', jobApplied: 'Go Developer', experience: '2 years', degree: 'Bachelor', major: 'Computer Science' },
  { id: 111, fullName: 'Jonathan Baker', location: 'Melbourne, VIC', jobApplied: 'Rust Developer', experience: '3 years', degree: 'Master', major: 'Computer Engineering' },
  { id: 112, fullName: 'Michelle Adams', location: 'Perth, WA', jobApplied: 'Machine Learning Engineer', experience: '5 years', degree: 'PhD', major: 'Artificial Intelligence' },
]

// Mock data for "Saved Candidates" section
const SAVED_CANDIDATES = [
  { id: 201, fullName: 'William Turner', location: 'Sydney, NSW', jobApplied: 'Platform Engineer', experience: '6 years', degree: 'Master', major: 'Software Engineering' },
  { id: 202, fullName: 'Jennifer Lee', location: 'Melbourne, VIC', jobApplied: 'Site Reliability Engineer', experience: '4 years', degree: 'Bachelor', major: 'Computer Science' },
  { id: 203, fullName: 'Robert Garcia', location: 'Brisbane, QLD', jobApplied: 'Infrastructure Engineer', experience: '5 years', degree: 'Bachelor', major: 'Information Technology' },
  { id: 204, fullName: 'Laura Miller', location: 'Sydney, NSW', jobApplied: 'Database Administrator', experience: '7 years', degree: 'Master', major: 'Computer Science' },
  { id: 205, fullName: 'Thomas Jackson', location: 'Perth, WA', jobApplied: 'Network Engineer', experience: '5 years', degree: 'Bachelor', major: 'Network Engineering' },
  { id: 206, fullName: 'Karen Hernandez', location: 'Melbourne, VIC', jobApplied: 'Systems Administrator', experience: '4 years', degree: 'Bachelor', major: 'Information Systems' },
  { id: 207, fullName: 'Steven Lopez', location: 'Sydney, NSW', jobApplied: 'Technical Support Engineer', experience: '3 years', degree: 'Diploma', major: 'IT Support' },
  { id: 208, fullName: 'Patricia Gonzalez', location: 'Brisbane, QLD', jobApplied: 'IT Support Specialist', experience: '2 years', degree: 'Certificate', major: 'Technical Support' },
  { id: 209, fullName: 'Charles Nelson', location: 'Melbourne, VIC', jobApplied: 'Business Analyst', experience: '4 years', degree: 'Bachelor', major: 'Business Administration' },
  { id: 210, fullName: 'Linda Carter', location: 'Sydney, NSW', jobApplied: 'Technical Project Manager', experience: '6 years', degree: 'Master', major: 'Project Management' },
  { id: 211, fullName: 'Joseph Mitchell', location: 'Perth, WA', jobApplied: 'QA Engineer', experience: '3 years', degree: 'Bachelor', major: 'Software Engineering' },
  { id: 212, fullName: 'Barbara Perez', location: 'Brisbane, QLD', jobApplied: 'Test Automation Engineer', experience: '4 years', degree: 'Bachelor', major: 'Computer Science' },
]

function RecommendedCandidate() {
  const [filters, setFilters] = useState({
    candidateName: '',
    location: '',
    experienceLevel: '',
    degreeType: '',
    major: '',
    certification: '',
    language: '',
    workArrangement: '',
    industry: '',
    roleLevel: '',
    availability: '',
    sortBy: 'Most Relevant',
  })

  const [showFilters, setShowFilters] = useState(false)

  const [visibleCounts, setVisibleCounts] = useState({
    aiChosen: 6,
    viewed: 6,
    related: 6,
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      candidateName: '',
      location: '',
      experienceLevel: '',
      degreeType: '',
      major: '',
      certification: '',
      language: '',
      workArrangement: '',
      industry: '',
      roleLevel: '',
      availability: '',
      sortBy: 'Most Relevant',
    })
  }

  const handleShowMore = (section) => {
    const dataMap = {
      aiChosen: AI_CHOSEN_CANDIDATES,
      viewed: SEARCH_HISTORY_CANDIDATES,
      related: SAVED_CANDIDATES,
    }
    setVisibleCounts(prev => ({
      ...prev,
      [section]: Math.min(prev[section] + 6, dataMap[section].length),
    }))
  }

  const handleShowLess = (section) => {
    setVisibleCounts(prev => ({ ...prev, [section]: 6 }))
  }

  const renderCandidateSection = (title, candidates, visibleCount, sectionKey) => {
    const displayedCandidates = candidates.slice(0, visibleCount)
    const hasMore = visibleCount < candidates.length
    const hasLess = visibleCount > 6

    return (
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {displayedCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        <div className="flex justify-center gap-3">
          {hasMore && (
            <button
              onClick={() => handleShowMore(sectionKey)}
              className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
            >
              Show More
            </button>
          )}
          {hasLess && (
            <button
              onClick={() => handleShowLess(sectionKey)}
              className="cursor-pointer rounded-full border-0 bg-slate-600 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-slate-700 hover:shadow-[0_4px_14px_rgba(71,85,105,0.3)]"
            >
              Show Less
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        <Contact />

        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Page Header */}
          <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <h1 className="mb-2.5 text-[1.6rem] text-slate-900 font-semibold">Recommended Candidates</h1>
            <p className="text-slate-600 leading-relaxed">
              Discover top talent curated for your hiring needs. Use the filters below to find the perfect candidates for your open positions.
            </p>
          </section>

          {/* Advanced Filter Section */}
          <CandidateFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Candidate Sections */}
          {renderCandidateSection('Chosen By Workmate A.I', AI_CHOSEN_CANDIDATES, visibleCounts.aiChosen, 'aiChosen')}
          {renderCandidateSection('Based on Search History', SEARCH_HISTORY_CANDIDATES, visibleCounts.viewed, 'viewed')}
          {renderCandidateSection('Saved Candidates', SAVED_CANDIDATES, visibleCounts.related, 'related')}
        </div>

        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default RecommendedCandidate
