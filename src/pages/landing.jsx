import { useState } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const MUTED_COLOR = 'hsl(240, 4%, 66%)';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'reachUs', label: 'Reach Us' },
];

const CONTENT = {
  about: {
    title: 'About Workmate',
    body: [
      'Workmate was born in 2026 at the University of Wollongong. As students, we experienced the frustration of the modern job market: a place where brilliant potential is often drowned out by the noise of thousands of applications. We realized that "getting noticed" shouldn\'t be a game of luck.',
      'We don\'t just match resumes. we illuminate paths.',
    ],
  },
  reachUs: {
    title: 'Reach Us',
    body: [
      'Our Group Members:',
      'Minh Huy Loi (Frontend Developer) ',
      'The Long Tran (Backend Developer) ',
      'Hoang Thanh Truc Nguyen (UI/UX Designer) ',
      'Thi Tuong Vy Tran (UI/UX Designer) ',
    ],
  },
};

function NavLink({ id, label, active, onClick }) {
  return (
    <button
      type="button"
      className="text-sm transition-colors bg-transparent border-none cursor-pointer p-0"
      style={{ color: active ? '#fff' : MUTED_COLOR }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = active ? '#fff' : MUTED_COLOR)
      }
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
}

export default function LandingPage() {
  const [view, setView] = useState('home');

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
          <button
            type="button"
            className="text-3xl tracking-tight select-none text-white bg-transparent border-none cursor-pointer p-0"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            onClick={() => setView('home')}
          >
            Workmate<sup className="text-xs">®</sup>
          </button>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ id, label }) => (
              <NavLink
                key={id}
                id={id}
                label={label}
                active={view === id}
                onClick={setView}
              />
            ))}
          </div>

          {/* Nav CTA */}
          <Link
            to="/login"
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03] inline-block no-underline"
          >
            Begin Your Journey
          </Link>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-[90px] pb-[90px]">
        {view === 'home' ? (
          <div key="home">
            <h1
              className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal text-white"
              style={{
                fontFamily: "'Instrument Serif', serif",
                lineHeight: '0.95',
                letterSpacing: '-2.46px',
              }}
            >
              <em className="not-italic" style={{ color: MUTED_COLOR }}>
              Where
              </em>{' '}
              Talents {' '}
              <em className="not-italic" style={{ color: MUTED_COLOR }}>
               Meets Its
              </em>{' '}
              True Worth{' '}
            </h1>
            <p
              className="animate-fade-rise-delay text-base sm:text-lg max-w-2xl mt-8 leading-relaxed"
              style={{ color: MUTED_COLOR }}
            >
              In a crowded market, we don’t just match resumes to roles.
              Our AI understands your unique journey to bridge the gap
              between human potential and the perfect opportunity.
            </p>

            <Link
              to="/login"
              className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-white mt-12 transition-transform hover:scale-[1.03] cursor-pointer inline-block no-underline"
            >
              Begin Your Journey
            </Link>
          </div>
        ) : (
          <div key={view} className="max-w-2xl">
            <h2
              className="animate-fade-rise text-4xl sm:text-5xl md:text-6xl font-normal text-white"
              style={{
                fontFamily: "'Instrument Serif', serif",
                lineHeight: '1.05',
                letterSpacing: '-1.5px',
              }}
            >
              {CONTENT[view].title}
            </h2>

            {CONTENT[view].body.map((paragraph, i) => (
              <p
                key={i}
                className={`animate-fade-rise-delay text-base sm:text-lg leading-relaxed ${i === 0 ? 'mt-8' : 'mt-4'}`}
                style={{ color: MUTED_COLOR }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
