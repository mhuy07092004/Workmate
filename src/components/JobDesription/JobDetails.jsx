/**
 * JobDetails.jsx — Job description content component
 *
 * Props:
 *   - description: {
 *       requirements: string,
 *       whatWeNeed: string,
 *       aboutCompany: string,
 *       benefits?: string
 *     }
 */

function JobDetails({ description }) {
  const { requirements, whatWeNeed, aboutCompany, benefits } = description

  return (
    <div className="bg-white rounded-[14px] p-8 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
      {/* Requirements Section */}
      <section className="mb-8">
        <h2 className="text-[1.3rem] font-bold text-slate-900 mb-4">
          Requirements
        </h2>
        <div className="text-slate-600 leading-relaxed whitespace-pre-line">
          {requirements}
        </div>
      </section>

      {/* What We Need Section */}
      <section className="mb-8">
        <h2 className="text-[1.3rem] font-bold text-slate-900 mb-4">
          What We Need From You
        </h2>
        <div className="text-slate-600 leading-relaxed whitespace-pre-line">
          {whatWeNeed}
        </div>
      </section>

      {/* About Company Section */}
      <section className="mb-8">
        <h2 className="text-[1.3rem] font-bold text-slate-900 mb-4">
          About Our Company
        </h2>
        <div className="text-slate-600 leading-relaxed whitespace-pre-line">
          {aboutCompany}
        </div>
      </section>

      {/* Benefits Section (optional) */}
      {benefits && (
        <section>
          <h2 className="text-[1.3rem] font-bold text-slate-900 mb-4">
            Benefits
          </h2>
          <div className="text-slate-600 leading-relaxed whitespace-pre-line">
            {benefits}
          </div>
        </section>
      )}
    </div>
  )
}

export default JobDetails
