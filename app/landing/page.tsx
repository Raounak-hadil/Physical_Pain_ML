import Link from "next/link";

const riskTags = [
  { label: "Back Pain", dot: "bg-red-600" },
  { label: "Neck Strain", dot: "bg-orange-500" },
  { label: "Tension Headaches", dot: "bg-fuchsia-500" },
  { label: "Wrist Pain", dot: "bg-indigo-500" },
  { label: "Eye Strain", dot: "bg-emerald-500" },
  { label: "Finger Numbness", dot: "bg-pink-600" },
];

const processSteps = [
  {
    number: "01",
    title: "Answer the Survey",
    text: "Complete our 33-question assessment covering your study habits, environment, physical activity, and current discomfort levels.",
  },
  {
    number: "02",
    title: "Get Your Prediction",
    text: "Our algorithm analyzes your responses to calculate personalized risk percentages for six types of musculoskeletal pain.",
    featured: true,
  },
  {
    number: "03",
    title: "Take Action",
    text: "Review your results and use the insights to adjust your study habits, workspace setup, and lifestyle choices.",
  },
];

const assessCards = [
  {
    title: "Comprehensive Assessment",
    text: "33 research-backed questions covering study habits, environment, lifestyle, and pain indicators.",
    icon: "clipboard",
  },
  {
    title: "Behavior Analysis",
    text: "Evaluate how your daily study routines, posture, and screen time impact your physical health.",
    icon: "brain",
  },
  {
    title: "Pain Prediction",
    text: "Get personalized risk percentages for back pain, neck strain, headaches, wrist pain, eye strain, and more.",
    icon: "heart",
  },
  {
    title: "Ergonomic Insights",
    text: "Understand how your workspace setup, seating, and screen positioning affect your comfort.",
    icon: "monitor",
  },
  {
    title: "Lifestyle Factors",
    text: "See how physical activity, sleep, hydration, and caffeine intake connect to study-related discomfort.",
    icon: "pulse",
    featured: true,
  },
  {
    title: "Actionable Results",
    text: "Receive a detailed breakdown of your risk factors with clear, science-informed recommendations.",
    icon: "shield",
  },
];

const tips = [
  {
    title: "Take Regular Breaks",
    text: "Follow the 25/5 Pomodoro rule: study for 25 minutes, then take a 5-minute movement break.",
    icon: "timer",
  },
  {
    title: "Move Your Body",
    text: "Stand up and stretch every 30 minutes. Walk around briefly to reset posture and circulation.",
    icon: "move",
    featured: true,
  },
  {
    title: "Fix Your Posture",
    text: "Keep your screen at eye level, feet flat on the floor, and shoulders relaxed while studying.",
    icon: "spark",
  },
  {
    title: "Protect Your Eyes",
    text: "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
    icon: "eye",
  },
  {
    title: "Stay Hydrated",
    text: "Drink at least 2 liters of water per study day. Keep a bottle nearby and sip during every break.",
    icon: "drop",
    mint: true,
  },
  {
    title: "Limit Caffeine",
    text: "Keep caffeine under 400mg/day. Avoid energy drinks late in the day to protect sleep quality.",
    icon: "cup",
  },
  {
    title: "Prioritize Sleep",
    text: "Aim for 7–9 hours of sleep. Stop screen time 1 hour before bed and keep a consistent schedule.",
    icon: "moon",
  },
  {
    title: "Optimize Lighting",
    text: "Study in well-lit spaces with natural light when possible. Reduce glare and use warm light at night.",
    icon: "sun",
  },
  {
    title: "Lighten Your Load",
    text: "Keep your backpack under 10% of your body weight. Only carry what you need for the day.",
    icon: "stack",
  },
];

const themes = [
  {
    range: "Q1 - Q10",
    title: "Study Habits",
    text: "Hours, breaks, hydration, screen time, stress",
  },
  {
    range: "Q11 - Q19",
    title: "Study Environment",
    text: "Location, seating, posture, screen level, lighting",
  },
  {
    range: "Q20 - Q21",
    title: "Physical Activity",
    text: "Exercise frequency and sleep duration",
    featured: true,
  },
  {
    range: "Q22 - Q28",
    title: "Pain & Discomfort",
    text: "Back, neck, headaches, wrists, eyes, numbness levels",
  },
  {
    range: "Q29 - Q33",
    title: "Demographics",
    text: "Age, gender, institution, field, year of study",
  },
];

function Icon({ type }: { type: string }) {
  const common = "h-5 w-5";
  switch (type) {
    case "clipboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M9 3h6" />
          <path d="M10 2h4a1 1 0 0 1 1 1v2H9V3a1 1 0 0 1 1-1Z" />
          <path d="M8 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <path d="M8 11h8M8 15h5" />
        </svg>
      );
    case "brain":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M9.5 4a3 3 0 0 0-3 3v.5A2.5 2.5 0 0 0 4 10v1a2.5 2.5 0 0 0 1.5 2.3V15a3 3 0 0 0 3 3" />
          <path d="M14.5 4a3 3 0 0 1 3 3v.5A2.5 2.5 0 0 1 20 10v1a2.5 2.5 0 0 1-1.5 2.3V15a3 3 0 0 1-3 3" />
          <path d="M9.5 4A2.5 2.5 0 0 1 12 6.5V20" />
          <path d="M14.5 4A2.5 2.5 0 0 0 12 6.5" />
          <path d="M8 10.5A2.5 2.5 0 0 0 12 12" />
          <path d="M16 10.5A2.5 2.5 0 0 1 12 12" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M12 20s-7-4.35-9-8.5C1.4 8.1 3.2 5 6.7 5c2 0 3.2 1 4.3 2.4C12.1 6 13.3 5 15.3 5 18.8 5 20.6 8.1 21 11.5 19 15.65 12 20 12 20Z" />
          <path d="M8 11h2l1-2 2 5 1-3h2" />
        </svg>
      );
    case "monitor":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case "pulse":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
          <path d="m9.5 12 1.5 1.5 3.5-3.5" />
        </svg>
      );
    case "timer":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="13" r="7" />
          <path d="M12 13l2-2M9 3h6" />
        </svg>
      );
    case "move":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M3 12h18" />
          <path d="m8 7 4-4 4 4M8 17l4 4 4-4M7 8 3 12l4 4M17 8l4 4-4 4" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M12 2l1.6 4.8L18 8.4l-4.4 1.6L12 15l-1.6-5L6 8.4l4.4-1.6L12 2Z" />
          <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "drop":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M12 3s5 5.2 5 9a5 5 0 1 1-10 0c0-3.8 5-9 5-9Z" />
        </svg>
      );
    case "cup":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M6 7h9v5a4 4 0 0 1-4 4H9a3 3 0 0 1-3-3V7Z" />
          <path d="M15 8h2a2 2 0 1 1 0 4h-2M8 3v2M12 3v2" />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6 6 0 0 0 20 14.5Z" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2">
          <rect x="4" y="5" width="16" height="5" rx="1.5" />
          <rect x="4" y="14" width="16" height="5" rx="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-red-200 bg-red-100/70 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-red-700">
      {children}
    </div>
  );
}

// All cards look identical at rest. On hover: scale + red glow + red border + icon turns red-600/white + title turns red.
function Card({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
  featured?: boolean;
  mint?: boolean;
}) {
  return (
    <div
      className="group rounded-[28px] border border-black/8 bg-white/75 p-6 shadow-[0_6px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(225,29,72,0.13)] hover:border-red-300"
    >
      {/* Icon: red-50 bg at rest → red-600 bg + white icon on hover */}
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:border-red-200 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_10px_30px_rgba(225,29,72,0.25)]">
        <Icon type={icon} />
      </div>

      <h3 className="font-['Open_Sans'] text-[1.55rem] font-bold tracking-[-0.03em] text-neutral-950 transition-colors duration-300 group-hover:text-red-600">
        {title}
      </h3>

      <p className="mt-4 text-[1.08rem] leading-9 text-neutral-600 transition-colors duration-300 group-hover:text-neutral-700">
        {text}
      </p>
    </div>
  );
}

function StepCard({ number, title, text }: { number: string; title: string; text: string; featured?: boolean }) {
  return (
    <div className="group rounded-[28px] border border-black/8 bg-white/80 p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(225,29,72,0.13)] hover:border-red-300">
      <div className="text-[4rem] font-black leading-none tracking-[-0.06em] text-red-100 transition duration-500 group-hover:translate-x-1">
        {number}
      </div>
      <h3 className="font-['Open_Sans'] mt-4 text-[1.8rem] font-bold tracking-[-0.03em] text-neutral-950 transition-colors duration-300 group-hover:text-red-600">{title}</h3>
      <p className="mt-4 text-[1.06rem] leading-9 text-neutral-600">{text}</p>
    </div>
  );
}

function ThemeCard({ range, title, text }: { range: string; title: string; text: string; featured?: boolean }) {
  return (
    <div className="group rounded-[24px] border border-black/8 bg-white/80 p-6 text-center transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(225,29,72,0.13)] hover:border-red-300">
      <div className="text-sm font-bold tracking-[0.2em] text-red-600">{range}</div>
      <h3 className="font-['Open_Sans'] mt-4 text-[1.7rem] font-bold tracking-[-0.03em] text-neutral-950 transition-all duration-300 group-hover:text-red-600">
        {title}
      </h3>
      <p className="mt-3 text-[1rem] leading-8 text-neutral-600">{text}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f2f2] text-neutral-950 selection:bg-red-200 selection:text-neutral-950">
      <div className="mx-auto max-w-[1380px] px-3 pb-16 pt-0 sm:px-4 lg:px-5">

        <header className="sticky top-0 z-40 mb-6">
          <div className="rounded-b-[26px] border border-white/60 bg-white/78 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="group flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_12px_24px_rgba(225,29,72,0.28)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20s-7-4.35-9-8.5C1.4 8.1 3.2 5 6.7 5c2 0 3.2 1 4.3 2.4C12.1 6 13.3 5 15.3 5 18.8 5 20.6 8.1 21 11.5 19 15.65 12 20 12 20Z" />
                    <path d="M8 11h2l1-2 2 5 1-3h2" />
                  </svg>
                </div>
                <div className="font-['Open_Sans'] text-[1.55rem] font-bold tracking-[-0.04em] text-neutral-950">Study Physical Pain</div>
              </div>

              <Link
                href="/survey1"
                className="group inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(225,29,72,0.28)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-red-700"
              >
                <span>Start Assessment</span>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden rounded-[34px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.56))] px-6 py-14 shadow-[0_10px_50px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-10 lg:px-14 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.07),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.06),transparent_28%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <SectionBadge>Student Health Research Project</SectionBadge>

            <h1 className="font-['Open_Sans'] mt-8 text-[3.6rem] font-black leading-[0.95] tracking-[-0.08em] text-neutral-950 sm:text-[5.2rem] lg:text-[6.5rem]">
              <span className="title-word">Study</span>{" "}
              <span className="title-word text-red-600">Physical</span>{" "}
              <span className="title-word">Pain</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-[1.2rem] leading-10 text-neutral-600 sm:text-[1.35rem]">
              Discover how your study habits, workspace, and lifestyle affect your physical well-being.
              Take our research-backed assessment and get personalized pain risk predictions.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/survey1"
                className="group inline-flex items-center gap-3 rounded-2xl bg-red-600 px-7 py-4 text-lg font-semibold text-white shadow-[0_20px_45px_rgba(225,29,72,0.28)] transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-red-700"
              >
                <span>Take the Assessment</span>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>

              <a
                href="#tips"
                className="inline-flex items-center rounded-2xl border border-red-100 bg-red-50/70 px-7 py-4 text-lg font-medium text-neutral-800 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
              >
                Study Tips
              </a>
            </div>

            <div className="mt-16 border-t border-black/6 pt-10">
              <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-600">
                We predict risk for these conditions
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {riskTags.map((tag) => (
                  <div
                    key={tag.label}
                    className="group inline-flex items-center gap-3 rounded-full border border-black/6 bg-white/80 px-5 py-3 text-[1rem] font-medium text-neutral-900 shadow-[0_6px_20px_rgba(15,23,42,0.03)] transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-red-200 hover:shadow-[0_16px_35px_rgba(225,29,72,0.08)]"
                  >
                    <span className={`h-3.5 w-3.5 rounded-full ${tag.dot} transition-transform duration-500 group-hover:scale-125`} />
                    <span>{tag.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Image ── */}
        <section className="mt-10 overflow-hidden rounded-[34px] border border-white/60 bg-white/70 shadow-[0_10px_45px_rgba(15,23,42,0.04)] backdrop-blur-sm">
          <div className="relative h-[540px] w-full overflow-hidden sm:h-[620px]">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80"
              alt="Student studying at a desk"
              className="h-full w-full scale-[1.02] object-cover transition-transform duration-[2200ms] ease-out hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <div className="max-w-3xl">
                <h2 className="font-['Open_Sans'] text-[2rem] font-bold tracking-[-0.04em] text-white sm:text-[2.6rem]">
                  Prolonged study sessions can lead to musculoskeletal discomfort
                </h2>
                <p className="mt-3 text-lg leading-8 text-white/90">
                  Our tool helps identify risk factors before symptoms become chronic.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="mt-18 pt-4 text-center">
          <SectionBadge>Process</SectionBadge>
          <h2 className="font-['Open_Sans'] mt-6 text-[3rem] font-black tracking-[-0.07em] text-neutral-950 sm:text-[4.2rem]">How It Works</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[1.18rem] leading-9 text-neutral-600">
            Three simple steps to understand your study-related health risks.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {processSteps.map((step) => <StepCard key={step.number} {...step} />)}
          </div>
        </section>

        {/* ── Assessment ── */}
        <section className="mt-20 text-center">
          <SectionBadge>Assessment</SectionBadge>
          <h2 className="font-['Open_Sans'] mt-6 text-[3rem] font-black tracking-[-0.07em] text-neutral-950 sm:text-[4.2rem]">What We Assess</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[1.18rem] leading-9 text-neutral-600">
            A holistic evaluation of the factors that contribute to study-related physical discomfort.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {assessCards.map((card) => <Card key={card.title} {...card} />)}
          </div>
        </section>

        {/* ── Tips ── */}
        <section id="tips" className="mt-20 text-center">
          <SectionBadge>Expert Tips</SectionBadge>
          <h2 className="font-['Open_Sans'] mt-6 text-[3rem] font-black tracking-[-0.07em] text-neutral-950 sm:text-[4.2rem]">Better Study Sessions</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[1.18rem] leading-9 text-neutral-600">
            Science-backed advice to reduce pain and boost your focus while studying.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tips.map((tip) => <Card key={tip.title} {...tip} />)}
          </div>
        </section>

        {/* ── Themes ── */}
        <section className="mt-20 text-center">
          <SectionBadge>Research Areas</SectionBadge>
          <h2 className="font-['Open_Sans'] mt-6 text-[3rem] font-black tracking-[-0.07em] text-neutral-950 sm:text-[4.2rem]">Survey Themes</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[1.18rem] leading-9 text-neutral-600">
            Our assessment covers five key research areas.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {themes.map((theme) => <ThemeCard key={theme.title} {...theme} />)}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative mt-20 overflow-hidden rounded-[38px] bg-red-700 px-6 py-16 text-white shadow-[0_25px_70px_rgba(225,29,72,0.24)] sm:px-10 lg:px-14 lg:py-20">
          <div className="absolute -left-10 bottom-[-40px] h-44 w-44 rounded-full bg-white/8 blur-[0.5px]" />
          <div className="absolute -right-10 top-[-40px] h-44 w-44 rounded-full bg-white/8 blur-[0.5px]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/12 shadow-[0_12px_28px_rgba(0,0,0,0.14)] backdrop-blur">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="2">
                <path d="M12 20s-7-4.35-9-8.5C1.4 8.1 3.2 5 6.7 5c2 0 3.2 1 4.3 2.4C12.1 6 13.3 5 15.3 5 18.8 5 20.6 8.1 21 11.5 19 15.65 12 20 12 20Z" />
                <path d="M8 11h2l1-2 2 5 1-3h2" />
              </svg>
            </div>
            <h2 className="font-['Open_Sans'] mt-8 text-[2.7rem] font-black tracking-[-0.06em] text-white sm:text-[4rem]">
              Ready to check your study health?
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-[1.25rem] leading-10 text-white/90">
              Take our 5-minute assessment and discover how your study habits may be affecting your physical well-being.
            </p>
            <div className="mt-10">
              <Link
                href="/survey1"
                className="group inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-lg font-semibold text-neutral-950 shadow-[0_18px_40px_rgba(0,0,0,0.16)] transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02]"
              >
                <span>Start Assessment Now</span>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 rounded-[28px] border border-white/60 bg-white/70 px-6 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_10px_20px_rgba(225,29,72,0.22)] transition-transform duration-500 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20s-7-4.35-9-8.5C1.4 8.1 3.2 5 6.7 5c2 0 3.2 1 4.3 2.4C12.1 6 13.3 5 15.3 5 18.8 5 20.6 8.1 21 11.5 19 15.65 12 20 12 20Z" />
                  <path d="M8 11h2l1-2 2 5 1-3h2" />
                </svg>
              </div>
              <div className="font-['Open_Sans'] text-xl font-bold tracking-[-0.03em] text-neutral-950">Study Physical Pain</div>
            </div>
            <div className="text-sm text-neutral-500 sm:text-base">
              © 2026 Study Physical Pain — Student Comfort & Health Predictor. A student research project.
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}