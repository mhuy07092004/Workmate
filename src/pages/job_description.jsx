/**
 * job_description.jsx — Job Description page
 *
 * Features:
 *   - Navbar and Footer layout
 *   - Job title with company and posted date
 *   - Apply button
 *   - Detailed job description sections
 *   - Uses route param :id for dynamic routing
 */
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import JobTitle from '../components/JobDesription/JobTitle.jsx'
import JobDetails from '../components/JobDesription/JobDetails.jsx'
import ApplyJob from '../components/Button/ApplyJob.jsx'
import { getPostedJobById } from '../services/jobStore.js'

// Mock data for job description
const MOCK_JOB_DATA = {
  id: 1,
  title: 'Senior Software Engineer',
  company: 'Google',
  postedDate: '2025-04-20',
  location: 'Sydney, NSW',
  type: 'Full Time',
  salary: '$150k - $200k',
  description: {
    requirements: `We are looking for an experienced Software Engineer to join our growing team. The ideal candidate will have a strong background in software development, with expertise in modern web technologies and cloud platforms.

Key Responsibilities:
• Design and develop scalable software solutions
• Collaborate with cross-functional teams to define and implement new features
• Write clean, maintainable, and well-tested code
• Participate in code reviews and mentor junior developers
• Troubleshoot and debug complex technical issues`,
    whatWeNeed: `We need someone who is passionate about building great products and has a track record of delivering high-quality software. You should be comfortable working in a fast-paced environment and be able to adapt to changing requirements.

Required Qualifications:
• Bachelor's degree in Computer Science or related field
• 5+ years of professional software development experience
• Strong proficiency in JavaScript, React, and Node.js
• Experience with cloud platforms (AWS, GCP, or Azure)
• Excellent problem-solving and communication skills

Preferred Qualifications:
• Experience with TypeScript and modern frontend frameworks
• Knowledge of microservices architecture
• Familiarity with CI/CD pipelines and DevOps practices`,
    aboutCompany: `Google is a global technology leader focused on improving the ways people connect with information. Our innovations in web search and advertising have made our website a top internet property and our brand one of the most recognized in the world.

We are committed to building a diverse and inclusive workplace where everyone can thrive. Our Sydney office is home to teams working on cutting-edge products that impact billions of users worldwide.`,
    benefits: `• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development budget
• 20 days annual leave plus public holidays
• Parental leave and family support programs
• On-site gym and wellness programs
• Free meals and snacks at the office`,
  },
}

function JobDescription() {
  const { id } = useParams()

  // TODO (backend integration): fetch from GET /api/jobs/:id
  // For now, check the employer-posted store first, then fall back to mock data.
  const postedJob = getPostedJobById(id)

  function buildPostedJobExtras(pj) {
    const lines = []
    if (pj.industry) lines.push(`Industry: ${pj.industry}`)
    if (pj.roleLevel) lines.push(`Role Level: ${pj.roleLevel}`)
    if (pj.majorField || pj.major) lines.push(`Major / Field of Study: ${pj.majorField || pj.major}`)
    if (pj.certification) lines.push(`Required Certification: ${pj.certification}`)
    if (pj.preferredLanguages && pj.preferredLanguages.length > 0) {
      lines.push(`Preferred Languages: ${pj.preferredLanguages.join(', ')}`)
    }
    if (pj.availability && pj.availability.mode) {
      const avail = pj.availability.date
        ? `${pj.availability.mode} (${pj.availability.date})`
        : pj.availability.mode
      lines.push(`Start Availability: ${avail}`)
    }
    return lines.length > 0 ? '\n\nAdditional Requirements:\n• ' + lines.join('\n• ') : ''
  }

  const job = postedJob
    ? {
        ...MOCK_JOB_DATA,
        id: postedJob.id,
        title: postedJob.title,
        company: postedJob.company,
        location: postedJob.location,
        type: `${postedJob.employmentType} · ${postedJob.workArrangement}`,
        salary: postedJob.salary || MOCK_JOB_DATA.salary,
        description: {
          ...MOCK_JOB_DATA.description,
          requirements: (postedJob.description || MOCK_JOB_DATA.description.requirements) + buildPostedJobExtras(postedJob),
          whatWeNeed: postedJob.skills
            ? `Required Skills: ${postedJob.skills}\n\nYears of Experience: ${postedJob.experience ?? 'Not specified'}`
            : MOCK_JOB_DATA.description.whatWeNeed,
        },
      }
    : MOCK_JOB_DATA

  const handleApply = () => {
    // Backend DEV NOTE: Implement application submission
    // POST /api/jobs/:id/apply
    alert(`Applying for job ${id}: ${job.title}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8">
        {/* Job Title Section */}
        <JobTitle
          title={job.title}
          company={job.company}
          postedDate={job.postedDate}
        />

        {/* Apply Button Section */}
        <div className="mt-6 flex items-center gap-4">
          <ApplyJob onClick={handleApply} />
          <div className="text-slate-600">
            <span className="font-medium">{job.location}</span>
            <span className="mx-2 text-slate-400">|</span>
            <span>{job.type}</span>
            <span className="mx-2 text-slate-400">|</span>
            <span className="text-green-600 font-medium">{job.salary}</span>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="mt-6">
          <JobDetails description={job.description} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobDescription
