"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type RiskItem = {
  title: string;
  value: number;
  color: string;
  chip: string;
  chipTone: "low" | "moderate" | "high";
  factors: string[];
  recommendations: string[];
};

const baseRiskDetails: Record<string, {
  title: string;
  color: string;
  factors: string[];
  recommendations: string[];
}> = {
  back_pain: {
    title: "Back Pain",
    color: "#c70039",
    factors: ["Infrequent study breaks", "Non-ergonomic chair setup"],
    recommendations: [
      "Take a standing or walking break every 30 minutes",
      "Invest in an ergonomic office chair with lumbar support",
    ],
  },
  neck_pain: {
    title: "Neck Strain",
    color: "#ef6c0c",
    factors: [
      "Screen not at eye level",
      "Laptop-only input causes hunching",
      "High stress levels",
    ],
    recommendations: [
      "Position your screen at eye level using a laptop stand or books",
      "Do gentle neck stretches every 30 minutes",
      "Use an external monitor to reduce looking down at your laptop",
      "Practice chin tucks and neck rolls throughout the day",
      "Reduce stress with brief mindfulness or breathing exercises",
    ],
  },
  tension_headache: {
    title: "Tension Headaches",
    color: "#b04a9a",
    factors: ["Elevated stress during study", "Insufficient hydration"],
    recommendations: [
      "Follow the 20–20–20 rule: every 20 min, look 20 feet away for 20 sec",
      "Ensure your study space has adequate, even lighting",
      "Limit caffeine to 2–3 cups per day and avoid it after 2 PM",
    ],
  },
  wrist_pain: {
    title: "Wrist Pain",
    color: "#7174c6",
    factors: [
      "Non-ergonomic input method",
      "Not enough breaks",
    ],
    recommendations: [
      "Use an external keyboard and mouse when possible",
      "Keep your wrists in a neutral position while typing",
      "Do wrist circles and stretches every 30 minutes",
      "Consider a wrist rest or ergonomic keyboard",
    ],
  },
  eye_strain: {
    title: "Eye Strain",
    color: "#0e9a5b",
    factors: ["Infrequent eye breaks", "Screen below eye level"],
    recommendations: [
      "Apply the 20–20–20 rule consistently during study sessions",
      "Adjust screen brightness to match your surrounding lighting",
      "Use blue-light filtering glasses or enable night mode",
    ],
  },
  finger_numbness: {
    title: "Finger Numbness",
    color: "#c70039",
    factors: [
      "Poor input ergonomics",
      "Infrequent breaks",
    ],
    recommendations: [
      "Stretch and wiggle your fingers during every break",
      "Avoid gripping your pen or mouse too tightly",
      "Use an ergonomic mouse and keyboard to reduce strain",
    ],
  },
};

const generateRiskItems = (predictions: any): RiskItem[] => {
  if (!predictions) {
    // Return high-quality fallback mock data if no predictions loaded yet
    return [
      {
        title: "Back Pain",
        value: 44,
        color: "#c70039",
        chip: "Moderate Risk",
        chipTone: "moderate",
        factors: ["Infrequent study breaks"],
        recommendations: [
          "Take a standing or walking break every 30 minutes",
          "Invest in an ergonomic chair with lumbar support",
        ],
      },
      {
        title: "Neck Strain",
        value: 70,
        color: "#ef6c0c",
        chip: "High Risk",
        chipTone: "high",
        factors: [
          "Screen not at eye level",
          "Laptop-only input causes hunching",
          "High stress levels",
        ],
        recommendations: [
          "Position your screen at eye level using a laptop stand or books",
          "Do gentle neck stretches every 30 minutes",
          "Use an external monitor to reduce looking down at your laptop",
          "Practice chin tucks and neck rolls throughout the day",
          "Reduce stress with brief mindfulness or breathing exercises",
        ],
      },
      {
        title: "Tension Headaches",
        value: 53,
        color: "#b04a9a",
        chip: "High Risk",
        chipTone: "high",
        factors: ["Elevated stress during study"],
        recommendations: [
          "Follow the 20–20–20 rule: every 20 min, look 20 feet away for 20 sec",
          "Ensure your study space has adequate, even lighting",
          "Limit caffeine to 2–3 cups per day and avoid it after 2 PM",
        ],
      },
      {
        title: "Wrist Pain",
        value: 72,
        color: "#7174c6",
        chip: "High Risk",
        chipTone: "high",
        factors: [
          "Non-ergonomic input method",
          "Not enough breaks",
        ],
        recommendations: [
          "Use an external keyboard and mouse when possible",
          "Keep your wrists in a neutral position while typing",
          "Do wrist circles and stretches every 30 minutes",
          "Consider a wrist rest or ergonomic keyboard",
          "Reduce continuous typing by taking short voice-note breaks",
        ],
      },
      {
        title: "Eye Strain",
        value: 51,
        color: "#0e9a5b",
        chip: "High Risk",
        chipTone: "high",
        factors: ["Infrequent eye breaks", "Screen below eye level"],
        recommendations: [
          "Apply the 20–20–20 rule consistently during study sessions",
          "Adjust screen brightness to match your surrounding lighting",
          "Use blue-light filtering glasses or enable night mode",
        ],
      },
      {
        title: "Finger Numbness",
        value: 69,
        color: "#c70039",
        chip: "High Risk",
        chipTone: "high",
        factors: [
          "Poor input ergonomics",
          "Infrequent breaks",
          "Pre-existing condition",
        ],
        recommendations: [
          "Stretch and wiggle your fingers during every break",
          "Avoid gripping your pen or mouse too tightly",
          "Use an ergonomic mouse and keyboard to reduce strain",
        ],
      },
    ];
  }

  // Generate dynamically based on predictions
  return Object.keys(baseRiskDetails).map((key) => {
    const details = baseRiskDetails[key];
    const prediction = predictions[key];
    
    let value = 0;
    
    if (prediction) {
      // Calculate risk % based on probability expectation:
      // Risk % = P(Mild)*33 + P(Moderate)*67 + P(Chronic)*100
      const prob = prediction.probabilities || [0, 0, 0, 0];
      value = Math.round(prob[1] * 33 + prob[2] * 67 + prob[3] * 100);
    }

    let chip = "Low Risk";
    let chipTone: "low" | "moderate" | "high" = "low";
    
    if (value > 60) {
      chip = "High Risk";
      chipTone = "high";
    } else if (value > 30) {
      chip = "Moderate Risk";
      chipTone = "moderate";
    }

    return {
      title: details.title,
      value: value,
      color: details.color,
      chip: chip,
      chipTone: chipTone,
      factors: details.factors,
      recommendations: details.recommendations,
    };
  });
};

function HeartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 20s-7-4.35-9-8.5C1.4 8.1 3.2 5 6.7 5c2 0 3.2 1 4.3 2.4C12.1 6 13.3 5 15.3 5 18.8 5 20.6 8.1 21 11.5 19 15.65 12 20 12 20Z" />
      <path d="M8 11h2l1-2 2 5 1-3h2" />
    </svg>
  );
}

function RefreshIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
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

function WarningIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 3 4.5 7v5c0 5.2 3.5 8.6 7.5 9.9 4-1.3 7.5-4.7 7.5-9.9V7L12 3Z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function RiskChip({ tone, children }: { tone: "low" | "moderate" | "high"; children: React.ReactNode }) {
  const classes =
    tone === "high"
      ? "bg-[#fce8e6] text-[#c5221f]"
      : tone === "moderate"
      ? "bg-[#fef7e0] text-[#b06000]"
      : "bg-[#e6f4ea] text-[#137333]"; // low risk

  return <span className={`inline-flex rounded-full px-3 py-1 text-[14px] font-medium ${classes}`}>{children}</span>;
}

function MiniGauge({ value, color, size = 120, stroke = 10 }: { value: number; color: string; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size / 1.15 }}>
      <svg width={size} height={size / 1.15} viewBox={`0 0 ${size} ${size / 1.15}`} className="overflow-visible">
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 1 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#efe9ea"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 1 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute top-[44%] flex -translate-y-1/2 flex-col items-center">
        <div className="text-[20px] font-extrabold text-[#111111]">{value}%</div>
        <div className="-mt-1 text-[12px] text-[#776c70]">risk</div>
      </div>
    </div>
  );
}

function LargeGauge({ value }: { value: number }) {
  const size = 210;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  const label = value > 60 ? "High" : value > 30 ? "Moderate" : "Low";
  const labelColor = value > 60 ? "text-[#c5221f]" : value > 30 ? "text-[#b06000]" : "text-[#137333]";
  const strokeColor = value > 60 ? "#c70039" : value > 30 ? "#ef6c0c" : "#0e9a5b";

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: 180 }}>
      <svg width={size} height={180} viewBox={`0 0 ${size} 180`} className="overflow-visible">
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 1 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#f1ebec"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 1 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute top-[52%] flex -translate-y-1/2 flex-col items-center">
        <div className="text-[38px] font-extrabold tracking-[-0.04em] text-[#111111]">{value}%</div>
        <div className={`-mt-1 text-[24px] font-bold ${labelColor}`}>{label}</div>
      </div>
    </div>
  );
}

function BarChartCard({ items }: { items: RiskItem[] }) {
  return (
    <div className="rounded-[26px] border border-[#ece1e4] bg-white px-6 py-6 sm:px-7">
      <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-[#111111]">
        <span className="text-rose-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M4 20h16" />
            <path d="M7 20V9" />
            <path d="M12 20V4" />
            <path d="M17 20v-7" />
          </svg>
        </span>
        <span>Risk by Category</span>
      </div>

      <div className="relative h-[285px]">
        {[100, 75, 50, 25, 0].map((tick) => (
          <div key={tick} className="absolute inset-x-0 flex items-center" style={{ top: `${(100 - tick) * 0.85}%` }}>
            <span className="w-10 text-[13px] text-[#7e6f74]">{tick}%</span>
            <div className="ml-3 h-px flex-1 border-t border-dashed border-[#e8dcdf]" />
          </div>
        ))}

        <div className="absolute inset-x-6 bottom-0 flex items-end justify-between gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex w-full flex-col items-center gap-2">
              <div className="flex h-[210px] items-end">
                <div
                  className="w-9 rounded-t-[6px] sm:w-10 animate-pulse"
                  style={{ height: `${item.value * 2.1}px`, backgroundColor: item.color }}
                />
              </div>
              <div className="text-center text-[13px] leading-5 text-[#675c60]">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ item }: { item: RiskItem }) {
  return (
    <div className="rounded-[26px] border border-[#eddcdf] bg-white px-6 py-6 sm:px-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-bold tracking-[-0.02em] text-[#111111]">{item.title}</h3>
          <div className="mt-2">
            <RiskChip tone={item.chipTone}>{item.chip}</RiskChip>
          </div>
        </div>
        <MiniGauge value={item.value} color={item.color} />
      </div>

      <div className="mt-5">
        <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#796d71]">Contributing Factors</div>
        <div className="mt-3 space-y-2.5">
          {item.factors.map((factor) => (
            <div key={factor} className="flex items-start gap-2.5 text-[15px] text-[#1a1a1a]">
              <span className="mt-1 text-[#ef476f]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                </svg>
              </span>
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="my-5 border-t border-[#eee2e5]" />

      <div>
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#796d71]">
          <span>
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.74C8.63 15.2 9 16.05 9 17h6c0-.95.37-1.8 1-2.26A7 7 0 0 0 12 2Z" />
            </svg>
          </span>
          <span>Recommendations</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {item.recommendations.map((recommendation) => (
            <div key={recommendation} className="flex items-start gap-2.5 text-[15px] leading-7 text-[#6c6065]">
              <span className="mt-1 text-[#16a34a]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span>{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudyPhysicalPainResultsPage() {
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        setPredictions(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Failed to parse predictions:", e);
      }
    }
  }, []);

  const riskItems = generateRiskItems(predictions);
  const overallRisk = Math.round(riskItems.reduce((acc, item) => acc + item.value, 0) / riskItems.length);
  const elevatedRiskItems = riskItems.filter(item => item.value > 30);

  return (
    <main className="min-h-screen bg-[#faf7f8] text-[#171717]">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[#efe3e6] bg-[#fffdfd] shadow-[0_12px_35px_rgba(52,35,42,0.04)]">
          <div className="flex items-center justify-between border-b border-[#f1e7ea] px-6 py-4 sm:px-8">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#7b666d]">
              <HeartIcon className="h-4 w-4 text-rose-600" />
              <span>Study Physical Pain</span>
            </div>

            <Link
              href="/survey1"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f3e7e8] px-4 py-2.5 text-[15px] font-medium text-[#4f3f45] transition-all duration-200 hover:bg-[#eddcde]"
            >
              <RefreshIcon className="h-4 w-4" />
              <span>Retake</span>
            </Link>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex rounded-full bg-[#f7e6eb] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.2em] text-rose-700">
                Your Results
              </div>
              <h1 className="mt-5 text-[36px] font-extrabold tracking-[-0.06em] text-[#111111] sm:text-[44px]">
                Pain Risk Assessment
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-[17px] leading-8 text-[#6f6166]">
                Based on your survey responses, here is your personalized musculoskeletal pain risk profile.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div className="rounded-[26px] border border-[#ece1e4] bg-white px-6 py-6 text-center flex flex-col justify-center">
                <div className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#7e6f74]">Overall Risk</div>
                <div className="mt-3">
                  <LargeGauge value={overallRisk} />
                </div>
              </div>

              <BarChartCard items={riskItems} />
            </div>

            {elevatedRiskItems.length > 0 && (
              <div className="mt-10 rounded-[22px] border border-[#f0a2ad] bg-[#fbf0f2] px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#ff334f]">
                    <WarningIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#111111]">
                      Attention: {elevatedRiskItems.length} area{elevatedRiskItems.length > 1 ? "s" : ""} at elevated risk
                    </div>
                    <p className="mt-1 text-[15px] leading-7 text-[#6c6065]">
                      {elevatedRiskItems.map(item => item.title).join(", ")} {elevatedRiskItems.length > 1 ? "are" : "is"} at elevated or high risk. Review the recommendations below to take action.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <section className="mt-12">
              <h2 className="text-[24px] font-extrabold tracking-[-0.03em] text-[#111111]">Detailed Breakdown</h2>
              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                {riskItems.map((item) => (
                  <BreakdownCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <div className="mt-10 border-t border-[#ece1e4] pt-10 text-center">
              <h3 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#111111] sm:text-[40px]">
                Want to improve your score?
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-8 text-[#6f6166]">
                Follow the personalized recommendations above, adjust your habits, and retake the assessment in a few weeks to track your progress.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/survey1"
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-700 px-6 py-3.5 text-[16px] font-semibold text-white shadow-[0_10px_18px_rgba(190,24,93,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-800"
                >
                  <RefreshIcon className="h-4 w-4" />
                  <span>Retake Assessment</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f3e7e8] px-6 py-3.5 text-[16px] font-medium text-[#4f3f45] transition-all duration-200 hover:bg-[#eddcde]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
