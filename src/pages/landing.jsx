import './landing.css';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const MUTED_COLOR = 'hsl(240, 4%, 66%)';

const NAV_LINKS = ['Home', 'Studio', 'About', 'Journal', 'Reach Us'];

function NavLink({ label, active }) {
  return (
    <a
      href="#"
      className="text-sm transition-colors"
      style={{ color: active ? '#fff' : MUTED_COLOR }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = active ? '#fff' : MUTED_COLOR)
      }
    >
      {label}
    </a>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-root min-h-screen relative overflow-hidden">
      {/* ── Video Background ───────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="relative z-10">
        <div className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
          {/* Logo */}
          <span
            className="text-3xl tracking-tight select-none text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Velorah<sup className="text-xs">®</sup>
          </span>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link} label={link} active={link === 'Home'} />
            ))}
          </div>

          {/* Nav CTA */}
          <button
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03]"
          >
            Begin Journey
          </button>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-[90px] pb-[90px]">
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal text-white"
          style={{
            fontFamily: "'Instrument Serif', serif",
            lineHeight: '0.95',
            letterSpacing: '-2.46px',
          }}
        >
          Where{' '}
          <em className="not-italic" style={{ color: MUTED_COLOR }}>
            dreams
          </em>{' '}
          rise{' '}
          <em className="not-italic" style={{ color: MUTED_COLOR }}>
            through the silence.
          </em>
        </h1>

        <p
          className="animate-fade-rise-delay text-base sm:text-lg max-w-2xl mt-8 leading-relaxed"
          style={{ color: MUTED_COLOR }}
        >
          We&rsquo;re designing tools for deep thinkers, bold creators, and
          quiet rebels. Amid the chaos, we build digital spaces for sharp focus
          and inspired work.
        </p>

        <button
          className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-white mt-12 transition-transform hover:scale-[1.03] cursor-pointer"
        >
          Begin Journey
        </button>
      </section>
    </div>
  );
}
