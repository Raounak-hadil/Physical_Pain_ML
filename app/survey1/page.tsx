"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Choice = {
  label: string;
};

type Question = {
  id: number;
  type: "number" | "choice";
  prompt: string;
  unit?: string;
  placeholder?: string;
  options?: Choice[];
  min?: number;
  max?: number;
};

type Section = {
  key: string;
  title: string;
  description: string;
  questions: Question[];
};

const sections: Section[] = [
  {
    key: "study-habits",
    title: "Study Habits",
    description:
      "Tell us about your daily study routines, breaks, hydration, and screen time.",
    questions: [
      {
        id: 1,
        type: "number",
        prompt: "How many hours do you study per day?",
        placeholder: "e.g. 4.5",
        unit: "hours",
        min: 0,
        max: 16,
      },
      {
        id: 2,
        type: "number",
        prompt: "How many days do you study per week?",
        placeholder: "e.g. 5",
        unit: "days",
        min: 0,
        max: 7,
      },
      {
        id: 3,
        type: "number",
        prompt: "Longest sitting time without a break?",
        placeholder: "e.g. 2",
        unit: "hours",
        min: 0,
        max: 12,
      },
      {
        id: 4,
        type: "choice",
        prompt: "Do you take breaks while studying?",
        options: [
          { label: "Never" },
          { label: "Rarely (once per session)" },
          { label: "Sometimes (every 1–2 hours)" },
          { label: "Often (every 30–60 minutes)" },
          { label: "Always (every 20–30 minutes)" },
        ],
      },
      {
        id: 5,
        type: "choice",
        prompt: "How long is your usual break?",
        options: [
          { label: "I don't take breaks" },
          { label: "Less than 5 minutes" },
          { label: "5–10 minutes" },
          { label: "10–20 minutes" },
          { label: "More than 20 minutes" },
        ],
      },
      {
        id: 6,
        type: "choice",
        prompt: "Do you leave your desk during breaks?",
        options: [
          { label: "Yes, I walk around or stretch" },
          { label: "Sometimes" },
          { label: "No, I stay at my desk" },
        ],
      },
      {
        id: 7,
        type: "choice",
        prompt: "How much water do you drink on a study day?",
        options: [
          { label: "Less than 0.5L" },
          { label: "0.5L – 1L" },
          { label: "1L – 1.5L" },
          { label: "1.5L – 2L" },
          { label: "More than 2L" },
        ],
      },
      {
        id: 8,
        type: "choice",
        prompt: "How often do you drink caffeine or energy drinks while studying?",
        options: [
          { label: "Never" },
          { label: "Rarely (once a week)" },
          { label: "Sometimes (2–3 times a week)" },
          { label: "Often (daily)" },
          { label: "Very often (multiple times a day)" },
        ],
      },
      {
        id: 9,
        type: "number",
        prompt: "What is your daily screen time (phone + laptop)?",
        placeholder: "e.g. 8",
        unit: "hours",
        min: 0,
        max: 24,
      },
      {
        id: 10,
        type: "choice",
        prompt: "How would you rate your stress while studying?",
        options: [
          { label: "Very low" },
          { label: "Low" },
          { label: "Moderate" },
          { label: "High" },
          { label: "Very high" },
        ],
      },
    ],
  },
  {
    key: "study-environment",
    title: "Study Environment",
    description:
      "Tell us about where you study, your setup, posture, and lighting.",
    questions: [
      {
        id: 11,
        type: "choice",
        prompt: "Where do you mainly study?",
        options: [
          { label: "Desk or table" },
          { label: "Bed or couch" },
          { label: "Library" },
          { label: "Other place" },
        ],
      },
      {
        id: 12,
        type: "choice",
        prompt: "What seat do you usually use?",
        options: [
          { label: "Office chair" },
          { label: "Regular chair" },
          { label: "Bed or couch" },
          { label: "Stool or floor" },
        ],
      },
      {
        id: 13,
        type: "choice",
        prompt: "When using a laptop, what do you mostly use to type?",
        options: [
          { label: "Laptop keyboard only" },
          { label: "External keyboard" },
          { label: "Mixed" },
        ],
      },
      {
        id: 14,
        type: "choice",
        prompt: "How is your posture during most study sessions?",
        options: [
          { label: "Good posture" },
          { label: "Mostly okay" },
          { label: "Often slouched" },
          { label: "Very poor posture" },
        ],
      },
      {
        id: 15,
        type: "choice",
        prompt: "Do you lean on your back while studying?",
        options: [
          { label: "Yes" },
          { label: "Sometimes" },
          { label: "No" },
        ],
      },
      {
        id: 16,
        type: "choice",
        prompt: "Is your screen at eye level?",
        options: [
          { label: "Always" },
          { label: "Sometimes" },
          { label: "Rarely" },
          { label: "Never" },
        ],
      },
      {
        id: 17,
        type: "choice",
        prompt: "Do you have a medical condition that affects your back, neck, or wrists?",
        options: [
          { label: "Yes" },
          { label: "No" },
          { label: "Not sure" },
        ],
      },
      {
        id: 18,
        type: "choice",
        prompt: "How heavy is your backpack on a study day?",
        options: [
          { label: "Very light" },
          { label: "Light" },
          { label: "Moderate" },
          { label: "Heavy" },
          { label: "Very heavy" },
        ],
      },
      {
        id: 19,
        type: "choice",
        prompt: "How is your study lighting usually?",
        options: [
          { label: "Good lighting" },
          { label: "Okay" },
          { label: "Too dim" },
          { label: "Too bright" },
        ],
      },
    ],
  },
  {
    key: "physical-activity",
    title: "Physical Activity & Lifestyle",
    description:
      "Tell us about exercise and sleep.",
    questions: [
      {
        id: 20,
        type: "choice",
        prompt: "Do you exercise every week?",
        options: [
          { label: "Never" },
          { label: "1–2 times a week" },
          { label: "3–4 times a week" },
          { label: "5+ times a week" },
        ],
      },
      {
        id: 21,
        type: "choice",
        prompt: "How long do you usually sleep each night?",
        options: [
          { label: "Less than 5 hours" },
          { label: "5–6 hours" },
          { label: "7–8 hours" },
          { label: "More than 8 hours" },
        ],
      },
    ],
  },
  {
    key: "pain-discomfort",
    title: "Pain & Discomfort",
    description:
      "Tell us how often you feel study-related discomfort.",
    questions: [
      {
        id: 22,
        type: "choice",
        prompt: "How often do you feel back pain from studying?",
        options: [
          { label: "Never" },
          { label: "Rarely" },
          { label: "Sometimes" },
          { label: "Often" },
          { label: "Very often" },
        ],
      },
      {
        id: 23,
        type: "choice",
        prompt: "How often do you feel neck pain from studying?",
        options: [
          { label: "Never" },
          { label: "Rarely" },
          { label: "Sometimes" },
          { label: "Often" },
          { label: "Very often" },
        ],
      },
      {
        id: 24,
        type: "choice",
        prompt: "How often do you get tension headaches from studying?",
        options: [
          { label: "Never" },
          { label: "Rarely" },
          { label: "Sometimes" },
          { label: "Often" },
          { label: "Very often" },
        ],
      },
      {
        id: 25,
        type: "choice",
        prompt: "How often do you feel wrist pain while studying?",
        options: [
          { label: "Never" },
          { label: "Rarely" },
          { label: "Sometimes" },
          { label: "Often" },
          { label: "Very often" },
        ],
      },
      {
        id: 26,
        type: "choice",
        prompt: "How often do you get eye strain while studying?",
        options: [
          { label: "Never" },
          { label: "Rarely" },
          { label: "Sometimes" },
          { label: "Often" },
          { label: "Very often" },
        ],
      },
      {
        id: 27,
        type: "choice",
        prompt: "How often do you feel finger numbness while studying?",
        options: [
          { label: "Never" },
          { label: "Rarely" },
          { label: "Sometimes" },
          { label: "Often" },
          { label: "Very often" },
        ],
      },
      {
        id: 28,
        type: "choice",
        prompt: "How would you describe your overall physical discomfort?",
        options: [
          { label: "None" },
          { label: "Mild" },
          { label: "Moderate" },
          { label: "High" },
          { label: "Very high" },
        ],
      },
    ],
  },
  {
    key: "demographics",
    title: "Demographics",
    description:
      "Tell us a few basic details about yourself.",
    questions: [
      {
        id: 29,
        type: "number",
        prompt: "How old are you?",
        placeholder: "e.g. 21",
        min: 0,
        max: 100,
      },
      {
        id: 30,
        type: "choice",
        prompt: "What is your gender?",
        options: [
          { label: "Female" },
          { label: "Male" },
          { label: "Prefer not to say" },
        ],
      },
      {
        id: 31,
        type: "choice",
        prompt: "What type of institution do you attend?",
        options: [
          { label: "University" },
          { label: "College" },
          { label: "High school" },
          { label: "Other" },
        ],
      },
      {
        id: 32,
        type: "choice",
        prompt: "What is your main field of study?",
        options: [
          { label: "STEM" },
          { label: "Health sciences" },
          { label: "Business / Economics" },
          { label: "Humanities / Social sciences" },
          { label: "Other" },
        ],
      },
      {
        id: 33,
        type: "choice",
        prompt: "What is your current year of study?",
        options: [
          { label: "1st year" },
          { label: "2nd year" },
          { label: "3rd year" },
          { label: "4th year or above" },
        ],
      },
    ],
  },
];

const sectionLabels = [
  "Study Habits",
  "Study Environment",
  "Physical Activity & Lifestyle",
  "Pain & Discomfort",
  "Demographics",
];

function HeartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 20s-7-4.35-9-8.5C1.4 8.1 3.2 5 6.7 5c2 0 3.2 1 4.3 2.4C12.1 6 13.3 5 15.3 5 18.8 5 20.6 8.1 21 11.5 19 15.65 12 20 12 20Z" />
      <path d="M8 11h2l1-2 2 5 1-3h2" />
    </svg>
  );
}

function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeft({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M11 5l-7 7 7 7" />
    </svg>
  );
}

function SectionPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "rounded-full px-5 py-2 text-[14px] font-medium transition-all duration-200",
        active
          ? "bg-rose-700 text-white shadow-[0_6px_14px_rgba(190,24,93,0.18)]"
          : "bg-[#efe8e8] text-[#8c6d75] hover:bg-[#e7dddd]",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

function QuestionNumber({ value }: { value: number }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6e6ea] text-[18px] font-bold text-rose-700 transition-all duration-200 group-hover:bg-rose-700 group-hover:text-white group-data-[active=true]:bg-rose-700 group-data-[active=true]:text-white">
      {value}
    </div>
  );
}

function NumericQuestion({
  question,
  value,
  error,
  onChange,
}: {
  question: Question;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const active = value.length > 0;
  const min = question.min ?? 0;
  const max = question.max ?? 999;

  return (
    <div
      data-active={active}
      className="group rounded-[24px] border border-[#eedfe3] bg-white px-6 py-6 transition-all duration-200 hover:border-[#e7c7d0] sm:px-7 sm:py-7"
    >
      <div className="flex items-start gap-5">
        <QuestionNumber value={question.id} />

        <div className="min-w-0 flex-1">
          <h3 className="pt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-[#111111] sm:text-[18px]">{question.prompt}</h3>

          <div className="mt-6 flex max-w-[430px] items-center gap-3">
            <input
              value={value}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  onChange("");
                  return;
                }

                const num = Number(raw);
                if (Number.isNaN(num)) return;
                if (num < min || num > max) return;

                onChange(raw);
              }}
              type="number"
              min={min}
              max={max}
              step="any"
              placeholder={question.placeholder}
              className={[
                "h-14 w-full rounded-2xl border bg-white px-5 text-[15px] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#9f8b91] hover:border-[#dcb7c2] focus:ring-4",
                error
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-[#e6d8dc] focus:border-rose-400 focus:ring-rose-100",
              ].join(" ")}
            />
            {question.unit ? <span className="text-[15px] font-medium text-[#7d6d72]">{question.unit}</span> : null}
          </div>

          <div className="mt-2 min-h-[22px]">
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <p className="text-sm text-[#9b8b90]">
                Enter a value between {min} and {max}
                {question.unit ? ` ${question.unit}` : ""}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceQuestion({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="group rounded-[24px] border border-[#eedfe3] bg-white px-6 py-6 transition-all duration-200 hover:border-[#e7c7d0] sm:px-7 sm:py-7">
      <div className="flex items-start gap-5">
        <QuestionNumber value={question.id} />

        <div className="min-w-0 flex-1">
          <h3 className="pt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-[#111111] sm:text-[18px]">{question.prompt}</h3>

          <div className="mt-5 space-y-2.5">
            {question.options?.map((option) => {
              const selected = value === option.label;
              return (
                <label
                  key={option.label}
                  className={[
                    "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-200",
                    selected
                      ? "border-[#efc5d2] bg-[#fff6f8] shadow-[0_0_0_1px_rgba(190,24,93,0.04)]"
                      : "border-transparent bg-transparent hover:border-[#f1d9e0] hover:bg-[#fff8fa]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200",
                      selected ? "border-rose-700" : "border-[#ddcfd3]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full transition-all duration-200",
                        selected ? "bg-rose-700" : "bg-transparent",
                      ].join(" ")}
                    />
                  </span>

                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="sr-only"
                    checked={selected}
                    onChange={() => onChange(option.label)}
                  />

                  <span className="text-[15px] leading-7 text-[#1a1a1a]">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudyPhysicalPainSurveyPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [touched, setTouched] = useState<Record<number, boolean>>({});

  const section = sections[currentSection];
  const totalQuestions = useMemo(() => sections.reduce((acc, item) => acc + item.questions.length, 0), []);

  const getNumericError = (question: Question, value: string) => {
    if (question.type !== "number") return "";
    if (!value.trim()) return "This field is required.";

    const num = Number(value);
    const min = question.min ?? 0;
    const max = question.max ?? 999;

    if (Number.isNaN(num)) return "Please enter a valid number.";
    if (num < min) return `Value must be at least ${min}.`;
    if (num > max) return `Value must be less than or equal to ${max}.`;

    return "";
  };

  const isQuestionValid = (question: Question) => {
    const value = answers[question.id] ?? "";
    if (!value.trim()) return false;
    if (question.type === "number") return getNumericError(question, value) === "";
    return true;
  };

  const answeredCount = sections.reduce((count, current) => {
    return count + current.questions.filter((question) => isQuestionValid(question)).length;
  }, 0);

  const progressValue = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const progress = Math.round(progressValue);
  const sectionAnsweredCount = section.questions.filter((question) => isQuestionValid(question)).length;
  const sectionComplete = sectionAnsweredCount === section.questions.length;

  const setAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const markSectionTouched = () => {
    const nextTouched = { ...touched };
    section.questions.forEach((question) => {
      nextTouched[question.id] = true;
    });
    setTouched(nextTouched);
  };

  const goNext = () => {
    markSectionTouched();
    if (!sectionComplete) return;
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const completionMessage = sectionComplete
    ? currentSection === sections.length - 1
      ? "All questions answered — you can view your results"
      : "Section complete — you can continue"
    : `Answer all questions to continue (${sectionAnsweredCount}/${section.questions.length})`;

  return (
    <main className="min-h-screen bg-[#faf7f8] text-[#171717]">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[#efe3e6] bg-[#fffdfd] shadow-[0_12px_35px_rgba(52,35,42,0.04)]">
          <div className="border-b border-[#f1e7ea] px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-[#9f1d49]">
                  <HeartIcon className="h-4 w-4" />
                  <span>Study Physical Pain</span>
                </div>

                <div className="text-right text-[14px] text-[#7e6f74]">
                  <div>
                    <span className="font-semibold text-[#47373d]">{answeredCount}</span>
                    <span> / {totalQuestions} answered</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#f2dbe1]">
                  <div
                    className="h-full rounded-full bg-[#e4aab9] transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(progressValue, 100))}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px] text-[#8b7b80]">
                  <span>{progress}% complete</span>
                  <span>Section {currentSection + 1} of {sections.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-10 pt-6 sm:px-8">
            <div className="mb-8 flex flex-wrap gap-3">
              {sectionLabels.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCurrentSection(index)}
                  className="rounded-full"
                >
                  <SectionPill label={label} active={index === currentSection} />
                </button>
              ))}
            </div>

            <div>
              <div className="text-[13px] font-bold uppercase tracking-[0.25em] text-rose-700">
                Section {currentSection + 1} of {sections.length}
              </div>
              <h1 className="mt-3 text-[40px] font-extrabold tracking-[-0.05em] text-[#111111] sm:text-[44px]">
                {section.title}
              </h1>
              <p className="mt-3 max-w-3xl text-[17px] leading-8 text-[#6f6166]">{section.description}</p>
            </div>

            <div className="mt-10 space-y-4">
              {section.questions.map((question) => {
                const value = answers[question.id] ?? "";
                const showError = touched[question.id] || value.length > 0;
                const error = question.type === "number" && showError ? getNumericError(question, value) : "";

                if (question.type === "number") {
                  return (
                    <NumericQuestion
                      key={question.id}
                      question={question}
                      value={value}
                      error={error}
                      onChange={(next) => {
                        setAnswer(question.id, next);
                        setTouched((prev) => ({ ...prev, [question.id]: true }));
                      }}
                    />
                  );
                }

                return (
                  <ChoiceQuestion
                    key={question.id}
                    question={question}
                    value={value}
                    onChange={(next) => {
                      setAnswer(question.id, next);
                      setTouched((prev) => ({ ...prev, [question.id]: true }));
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-b-[28px] border-t border-[#f1e7ea] bg-[#fffdfd]/95 px-6 py-4 backdrop-blur sm:px-8">
            <button
              type="button"
              disabled={currentSection === 0}
              onClick={() => setCurrentSection((prev) => Math.max(prev - 1, 0))}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f4eef0] px-5 py-3 text-[15px] font-medium text-[#8d7d82] transition-all duration-200 hover:bg-[#ece2e5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="text-center text-[14px] font-medium text-[#8d7d82]">
              {completionMessage}
            </div>

            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!sectionComplete}
                className={[
                  "group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none",
                  sectionComplete
                    ? "bg-rose-700 shadow-[0_8px_16px_rgba(190,24,93,0.18)] hover:-translate-y-0.5 hover:bg-rose-800"
                    : "bg-rose-300",
                ].join(" ")}
              >
                <span>Next Section</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-enabled:group-hover:translate-x-0.5" />
              </button>
            ) : (
              <Link
                href="/results"
                onClick={(e) => {
                  markSectionTouched();
                  if (!sectionComplete) e.preventDefault();
                }}
                aria-disabled={!sectionComplete}
                className={[
                  "group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200",
                  sectionComplete
                    ? "bg-rose-700 shadow-[0_8px_16px_rgba(190,24,93,0.18)] hover:-translate-y-0.5 hover:bg-rose-800"
                    : "pointer-events-none bg-rose-300 shadow-none",
                ].join(" ")}
              >
                <span>See Results</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-enabled:group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
