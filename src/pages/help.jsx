import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const FAQS = [
  {
    question: 'How do I create an account?',
    answer: 'Click on "Join Now" in the top navigation bar. You can sign up as a Candidate looking for jobs or an Employer posting job opportunities.',
  },
  {
    question: 'How do I apply for a job?',
    answer: 'Browse recommended jobs on your dashboard, click on a job post to view details, and click the "Apply" button. Your profile will be sent to the employer.',
  },
  {
    question: 'How do I post a job?',
    answer: 'As an employer, click the "Post" button in your user dropdown menu. Fill in the job details, requirements, and submit for candidates to see.',
  },
  {
    question: 'Is Workmate free to use?',
    answer: 'Yes, Workmate is completely free for candidates. Employers can post jobs and browse candidates with our free tier.',
  },
  {
    question: 'How do I edit my profile?',
    answer: 'Click on your avatar in the top right corner and select "Your Profile" from the dropdown. Click the "Edit" button to make changes.',
  },
]

function Help() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Help Center</h1>
          <p className="mt-2 text-slate-600">Find answers or get in touch with our support team</p>
        </div>

        {/* FAQ Section */}
        <section className="mb-12 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between py-4 text-left font-medium text-slate-800 hover:text-blue-700"
                >
                  {faq.question}
                  <svg
                    className={`h-5 w-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <p className="pb-4 text-slate-600">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Need More Support? Contact Us</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone</h3>
                <p className="text-slate-600">+61 12345</p>
                <p className="text-sm text-slate-500">Mon-Fri, 9am-5pm AEST</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-600">mockemail@workmate.com</p>
                <p className="text-sm text-slate-500">We reply within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* Back to home link */}
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-blue-700 hover:underline">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Help