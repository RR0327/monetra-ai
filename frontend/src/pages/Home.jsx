
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
  Wallet,
  Sparkles,
  CalendarClock,
  BrainCircuit,
  CheckCircle2,
  LockKeyhole,
  TrendingUp,
  Activity,
} from "lucide-react";

import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    icon: BarChart3,
    title: "Track everything",
    label: "SPENDING INTELLIGENCE",
    description:
      "Bring your financial activity into focus. Understand income, expenses, and everyday spending habits with organized records and meaningful visual insights.",
    points: [
      "Transaction history and categories",
      "Income and expense breakdowns",
      "Visual spending insights",
    ],
  },
  {
    number: "02",
    icon: CalendarClock,
    title: "Plan ahead",
    label: "SMART FINANCIAL PLANNING",
    description:
      "Build better financial habits with clear budgets and upcoming payment reminders. Stay aware of your commitments and monitor progress toward your goals.",
    points: [
      "Category-based budget planning",
      "Upcoming bills and obligations",
      "Budget progress monitoring",
    ],
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Decide with clarity",
    label: "AI-POWERED GUIDANCE",
    description:
      "Explore possible financial outcomes before making decisions. Use transparent forecasts, purchase simulations, and understandable AI explanations.",
    points: [
      "Explainable financial forecasts",
      "What-if purchase simulations",
      "AI-assisted financial insights",
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">

      {/* =============== NAVBAR =============== */}

      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300">
            <Wallet size={25} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Monetra <span className="text-teal-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors duration-300 hover:bg-slate-800 hover:text-white sm:px-4"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-teal-400 px-3 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-300 sm:px-4"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* =============== HERO SECTION =============== */}

      <section className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">

        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-teal-500/5 blur-3xl" />

        {/* HERO LEFT */}

        <div className="relative hero-animate">

          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Your money, made clearer
          </p>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Make confident decisions with every taka.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Monetra AI brings your transactions, budgets, bills,
            and forecasts into one intelligent financial workspace.
          </p>

          {/* FINANCIAL INTELLIGENCE CARD */}

          <div className="group relative mt-9 max-w-xl overflow-hidden rounded-2xl border border-teal-400/20 bg-gradient-to-br from-slate-900 to-slate-900/70 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-2xl hover:shadow-teal-950/40">

            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl transition-all duration-500 group-hover:bg-teal-400/20" />

            <div className="relative flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Sparkles size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Financial Intelligence
                  </h3>

                  <p className="mt-1 text-xs text-teal-300">
                    Smarter insights for better decisions
                  </p>
                </div>

              </div>

              <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-[10px] font-medium text-teal-300">
                Coming soon
              </span>

            </div>

            <p className="relative mt-5 text-sm leading-7 text-slate-400">
              Understand your financial habits with explainable AI,
              transparent forecasts, and smarter financial planning.
              Explore insights designed to turn complex financial
              information into clear decisions.
            </p>

            <div className="relative mt-5 flex flex-wrap gap-2">

              {[
                "Explainable AI",
                "Smart Forecasts",
                "Privacy-conscious",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition-all duration-300 hover:border-teal-400/40 hover:text-teal-300"
                >
                  {item}
                </span>
              ))}

            </div>

            <div className="mt-6 h-[2px] w-12 rounded-full bg-teal-400/60 transition-all duration-500 group-hover:w-full" />

          </div>

          {/* ACCOUNT ACCESS INFO */}

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <LockKeyhole size={16} className="shrink-0 text-teal-400" />
            <span>
              Sign in or create an account to access your workspace.
            </span>
          </div>

        </div>

        {/* HERO RIGHT - FINANCIAL PREVIEW */}

        <div className="hero-animate-delayed relative rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-teal-950/30">

          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">

            <div>

              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-slate-400">
                  Financial overview
                </p>

                <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-1 text-[10px] font-medium text-teal-300">
                  Demo data
                </span>
              </div>

              <p className="mt-2 text-3xl font-bold text-white">
                ৳ 84,250
              </p>

              <p className="mt-2 flex items-center gap-1 text-xs text-teal-300">
                <TrendingUp size={14} />
                Example balance
              </p>

            </div>

            <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300">
              <BarChart3 size={25} />
            </span>

          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs text-slate-400 sm:text-sm">
                Monthly budget
              </p>

              <p className="mt-2 text-lg font-semibold text-teal-300 sm:text-xl">
                On track
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs text-slate-400 sm:text-sm">
                Upcoming bills
              </p>

              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                ৳ 12,400
              </p>
            </div>

          </div>

          {/* MINI FINANCIAL ACTIVITY */}

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={17} className="text-teal-300" />
                <p className="text-sm font-medium text-slate-200">
                  Spending overview
                </p>
              </div>

              <span className="text-xs text-slate-500">
                Sample month
              </span>
            </div>

            <div className="flex h-20 items-end justify-between gap-2">
              {[35, 60, 42, 75, 55, 90, 66, 48, 80, 58, 72, 50].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group/bar flex h-full flex-1 items-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 group-hover/bar:opacity-100 ${
                        index === 5
                          ? "bg-teal-400"
                          : "bg-teal-400/35 hover:bg-teal-400/70"
                      }`}
                    />
                  </div>
                )
              )}
            </div>

          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-teal-400/20 bg-teal-400/5 p-4 text-sm text-slate-300">

            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-teal-300"
            />

            <span>
              Explore financial insights using fictional demonstration data.
            </span>

          </div>

        </div>

      </section>

      {/* =============== FEATURES SECTION =============== */}

      <section
        id="features"
        className="relative overflow-hidden border-t border-slate-800/70 bg-slate-900/40 py-24 sm:py-28"
      >

        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70%] -translate-x-1/2 rounded-full bg-teal-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">

          <div className="feature-reveal mx-auto mb-14 max-w-2xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-teal-300">
              <Sparkles size={14} />
              Designed for financial clarity
            </span>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Everything you need to
              <span className="block bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                understand your money.
              </span>
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-400">
              Go beyond tracking expenses. Explore your financial
              habits, prepare for what comes next, and make more
              informed decisions from one simple workspace.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;

              return (
                <div
                  key={feature.number}
                  style={{
                    animationDelay: `${index * 0.12}s`,
                  }}
                  className="feature-reveal feature-card group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-teal-400/40 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-teal-950/30"
                >

                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal-400/5 blur-3xl transition-all duration-500 group-hover:bg-teal-400/15" />

                  <div className="relative flex items-start justify-between">

                    <div className="feature-icon flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-teal-400 group-hover:text-slate-950">
                      <FeatureIcon size={27} strokeWidth={1.7} />
                    </div>

                    <span className="text-4xl font-bold text-slate-800 transition-colors duration-500 group-hover:text-slate-700">
                      {feature.number}
                    </span>

                  </div>

                  <div className="relative mt-8">

                    <p className="text-[10px] font-bold tracking-[0.2em] text-teal-400">
                      {feature.label}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      {feature.description}
                    </p>

                  </div>

                  <div className="relative mt-7 space-y-3 border-t border-slate-800 pt-6">

                    {feature.points.map((point) => (
                      <div key={point} className="flex items-start gap-3">

                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-teal-400"
                        />

                        <span className="text-sm leading-6 text-slate-300">
                          {point}
                        </span>

                      </div>
                    ))}

                  </div>

                  <div className="relative mt-auto pt-8">
                    <div className="h-[2px] w-10 rounded-full bg-teal-400/50 transition-all duration-500 group-hover:w-full group-hover:bg-teal-400" />
                  </div>

                </div>
              );
            })}

          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Features shown represent the planned Monetra AI experience.
            Some capabilities are still under development.
          </p>

        </div>
      </section>

      {/* =============== PROJECT HIGHLIGHT =============== */}

      <section className="relative overflow-hidden bg-slate-950 px-6 py-24">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl rounded-3xl border border-teal-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 px-6 py-16 text-center shadow-2xl sm:px-12">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-300">
            <BrainCircuit size={28} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Built for the future of fintech
          </p>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Financial understanding,
            <span className="block text-teal-300">
              powered by intelligence.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-400">
            Monetra AI combines transparent financial calculations
            with explainable AI to help people better understand
            their money and explore financial possibilities.
          </p>

          <a
            href="#features"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400/10 px-7 py-3.5 font-semibold text-teal-300 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-400/20"
          >
            Explore our capabilities
            <ArrowUpRight
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>

          <p className="mt-5 text-xs text-slate-500">
            Educational prototype · Synthetic demonstration data
          </p>

        </div>
      </section>

      {/* =============== FOOTER =============== */}

      <footer className="relative border-t border-slate-800 bg-[#050b19]">

        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16">

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}

            <div className="sm:col-span-2 lg:col-span-1">

              <Link to="/" className="flex items-center gap-3">

                <span className="rounded-xl bg-teal-400/10 p-3 text-teal-300">
                  <Wallet size={25} />
                </span>

                <span className="text-xl font-bold tracking-tight text-white">
                  Monetra <span className="text-teal-400">AI</span>
                </span>

              </Link>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                An explainable, privacy-conscious personal finance
                copilot designed to make financial understanding
                simpler and smarter.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-teal-300">
                <ShieldCheck size={17} />
                Built with transparency in mind
              </div>

            </div>

            {/* EXPLORE */}

            <div>

              <h3 className="mb-6 text-sm font-semibold text-white">
                Explore
              </h3>

              <div className="flex flex-col gap-4 text-sm text-slate-400">

                <a href="#features" className="footer-link">
                  Features
                </a>

                <Link to="/login" className="footer-link">
                  Dashboard access
                </Link>

                <Link to="/register" className="footer-link">
                  Get started
                </Link>

              </div>

            </div>

            {/* PROJECT */}

            <div>

              <h3 className="mb-6 text-sm font-semibold text-white">
                Project
              </h3>

              <div className="flex flex-col gap-4 text-sm text-slate-400">

                <a
                  href="https://github.com/RR0327/monetra-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub repository
                </a>

                <a
                  href="https://github.com/RR0327/monetra-ai/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Documentation
                </a>

                <a
                  href="https://github.com/RR0327/monetra-ai/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  MIT License
                </a>

              </div>

            </div>

            {/* ABOUT */}

            <div>

              <h3 className="mb-6 text-sm font-semibold text-white">
                About the project
              </h3>

              <p className="text-sm leading-7 text-slate-400">
                Developed by Tech_Innovators for the 2026
                Shenzhen International FinTech Competition.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-teal-400/20 bg-teal-400/5 px-3 py-2 text-xs text-teal-300">

                <span className="h-2 w-2 rounded-full bg-teal-400" />

                Prototype in development

              </div>

            </div>

          </div>

          {/* FOOTER BOTTOM */}

          <div className="mt-14 flex flex-col gap-5 border-t border-slate-800 pt-7 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">

            <p>
              © 2026 Tech_Innovators. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

              <span>Monetra AI</span>

              <span className="text-slate-700">•</span>

              <span>Educational prototype</span>

              <span className="text-slate-700">•</span>

              <span>Not financial advice</span>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}
