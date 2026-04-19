/**
 * FeatureCardGrid — Reusable feature card grid component
 *
 * Props:
 *   - cards: Array of { title: string, description: string } objects
 *
 * Displays a responsive 3-column grid of feature cards with consistent styling.
 */

function FeatureCardGrid({ cards = [] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, index) => (
        <article
          key={index}
          className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]"
        >
          <h2 className="mb-2 text-[1.15rem] text-slate-900">{card.title}</h2>
          <p className="text-slate-600 leading-relaxed">{card.description}</p>
        </article>
      ))}
    </section>
  )
}

export default FeatureCardGrid
