"use client";

import { useEffect, useMemo, useState } from "react";
import {
  emptySemester,
  emptySubject,
  estimateGpaFromPercentage,
  estimatePercentage,
  formatNumber,
  getPerformance,
  gradeReference,
  gradingScales,
  sampleSemesters,
  sampleSubjects,
  toNumber,
  validateSemesters,
  validateSubjects,
  type GradingScaleKey,
  type Result,
  type SemesterRow,
  type SubjectRow,
} from "@/lib/academic-calculator";

const storageKey = "academic-gpa-cgpa-calculator-v1";

type ActiveTab = "gpa" | "cgpa";

type StoredState = {
  activeTab: ActiveTab;
  subjects: SubjectRow[];
  semesters: SemesterRow[];
  scale: GradingScaleKey;
  converterGpa: string;
  converterPercentage: string;
};

function FieldLabel({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"
    />
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
    />
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-slate-100 sm:w-auto"
    />
  );
}

function ResultCard({
  title,
  result,
  emptyText,
}: {
  title: string;
  result: Result | null;
  emptyText: string;
}) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {result ? "Calculated from the current entries." : emptyText}
      </p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Metric label="GPA / CGPA" value={result ? formatNumber(result.weightedValue) : "-"} />
        <Metric label="Total Credits" value={result ? formatNumber(result.totalCredits) : "-"} />
        <Metric
          label="Total Grade Points"
          value={result ? formatNumber(result.totalGradePoints) : "-"}
        />
        <Metric
          label="Estimated Percentage"
          value={result ? `${formatNumber(result.percentage)}%` : "-"}
        />
        <Metric label="Performance Label" value={result?.performance ?? "-"} />
      </div>
      <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        Results are estimates. Universities may use different grading scales and percentage
        conversion methods.
      </p>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gpa");
  const [subjects, setSubjects] = useState<SubjectRow[]>(sampleSubjects);
  const [semesters, setSemesters] = useState<SemesterRow[]>(sampleSemesters);
  const [scale, setScale] = useState<GradingScaleKey>("sppu");
  const [gpaResult, setGpaResult] = useState<Result | null>(null);
  const [cgpaResult, setCgpaResult] = useState<Result | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [converterGpa, setConverterGpa] = useState("8.5");
  const [converterPercentage, setConverterPercentage] = useState("75");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<StoredState>;
          if (parsed.activeTab === "gpa" || parsed.activeTab === "cgpa") {
            setActiveTab(parsed.activeTab);
          }
          if (Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
            setSubjects(parsed.subjects);
          }
          if (Array.isArray(parsed.semesters) && parsed.semesters.length > 0) {
            setSemesters(parsed.semesters);
          }
          if (parsed.scale && parsed.scale in gradingScales) {
            setScale(parsed.scale);
          }
          if (typeof parsed.converterGpa === "string") {
            setConverterGpa(parsed.converterGpa);
          }
          if (typeof parsed.converterPercentage === "string") {
            setConverterPercentage(parsed.converterPercentage);
          }
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      setHasHydrated(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    const storedState: StoredState = {
      activeTab,
      subjects,
      semesters,
      scale,
      converterGpa,
      converterPercentage,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storedState));
  }, [activeTab, converterGpa, converterPercentage, hasHydrated, scale, semesters, subjects]);

  const nextSubjectId = useMemo(
    () => Math.max(0, ...subjects.map((row) => row.id)) + 1,
    [subjects],
  );
  const nextSemesterId = useMemo(
    () => Math.max(0, ...semesters.map((row) => row.id)) + 1,
    [semesters],
  );

  const convertedPercentage = useMemo(() => {
    const numberValue = toNumber(converterGpa);
    return Number.isFinite(numberValue) ? estimatePercentage(numberValue, scale) : null;
  }, [converterGpa, scale]);

  const convertedGpa = useMemo(() => {
    const numberValue = toNumber(converterPercentage);
    return Number.isFinite(numberValue) ? estimateGpaFromPercentage(numberValue, scale) : null;
  }, [converterPercentage, scale]);

  function calculateGpa() {
    const { messages: validationMessages, validRows } = validateSubjects(subjects);
    if (validationMessages.length) {
      setMessages(validationMessages);
      setGpaResult(null);
      return;
    }

    const totalCredits = validRows.reduce((sum, row) => sum + row.creditsNumber, 0);
    const totalGradePoints = validRows.reduce(
      (sum, row) => sum + row.creditsNumber * row.gradePointNumber,
      0,
    );
    const weightedGpa = totalGradePoints / totalCredits;

    setMessages([]);
    setGpaResult({
      totalCredits,
      totalGradePoints,
      weightedValue: weightedGpa,
      percentage: estimatePercentage(weightedGpa, scale),
      performance: getPerformance(weightedGpa),
    });
  }

  function calculateCgpa() {
    const { messages: validationMessages, validRows } = validateSemesters(semesters);
    if (validationMessages.length) {
      setMessages(validationMessages);
      setCgpaResult(null);
      return;
    }

    const totalCredits = validRows.reduce((sum, row) => sum + row.creditsNumber, 0);
    const totalGradePoints = validRows.reduce(
      (sum, row) => sum + row.creditsNumber * row.gpaNumber,
      0,
    );
    const cgpa = totalGradePoints / totalCredits;

    setMessages([]);
    setCgpaResult({
      totalCredits,
      totalGradePoints,
      weightedValue: cgpa,
      percentage: estimatePercentage(cgpa, scale),
      performance: getPerformance(cgpa),
    });
  }

  function resetAll() {
    setSubjects(sampleSubjects);
    setSemesters(sampleSemesters);
    setGpaResult(null);
    setCgpaResult(null);
    setMessages([]);
    setCopied(false);
    setScale("sppu");
    setConverterGpa("8.5");
    setConverterPercentage("75");
    setActiveTab("gpa");
    window.localStorage.removeItem(storageKey);
  }

  function clearRows() {
    if (activeTab === "gpa") {
      setSubjects([emptySubject(1)]);
      setGpaResult(null);
    } else {
      setSemesters([emptySemester(1)]);
      setCgpaResult(null);
    }
    setMessages([]);
  }

  function resultText() {
    const activeResult = activeTab === "gpa" ? gpaResult : cgpaResult;
    if (!activeResult) return "No result calculated yet.";

    return [
      activeTab === "gpa" ? "Semester GPA Result" : "Overall CGPA Result",
      `GPA / CGPA: ${formatNumber(activeResult.weightedValue)}`,
      `Total credits: ${formatNumber(activeResult.totalCredits)}`,
      `Total grade points: ${formatNumber(activeResult.totalGradePoints)}`,
      `Estimated percentage: ${formatNumber(activeResult.percentage)}%`,
      `Performance: ${activeResult.performance}`,
      `Scale: ${gradingScales[scale].label}`,
      "",
      "Formula: GPA = Sum of Credit x Grade Point / Total Credits",
    ].join("\n");
  }

  async function copyResult() {
    await navigator.clipboard.writeText(resultText());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadResult() {
    const blob = new Blob([resultText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeTab === "gpa" ? "semester-gpa-result.txt" : "overall-cgpa-result.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <a className="text-base font-semibold text-slate-950" href="#">
                Academic GPA & CGPA Calculator
              </a>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                Free Student Tool
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              <a className="hover:text-emerald-700" href="#calculator">
                Calculator
              </a>
              <a className="hover:text-emerald-700" href="#gpa-guide">
                GPA Guide
              </a>
              <a className="hover:text-emerald-700" href="#about">
                About
              </a>
            </div>
          </nav>
        </div>
      </header>

      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Academic GPA & CGPA Calculator
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Calculate semester GPA, cumulative CGPA, and percentage using your university
              grading system.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section
          id="calculator"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="grid gap-4 border-b border-slate-200 pb-4 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Calculator</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Select a university reference scale, enter credits and grade points, then calculate.
                Your entries are saved in this browser automatically.
              </p>
            </div>
            <FieldLabel label="University grading scale">
              <SelectInput
                value={scale}
                onChange={(event) => setScale(event.target.value as GradingScaleKey)}
              >
                {Object.entries(gradingScales).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </SelectInput>
            </FieldLabel>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">{gradingScales[scale].description}</p>

          <div className="mt-4 grid rounded-lg bg-slate-100 p-1 text-sm font-semibold text-slate-600 sm:w-fit sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("gpa");
                setMessages([]);
              }}
              className={`rounded-md px-4 py-2 transition ${
                activeTab === "gpa" ? "bg-white text-emerald-800 shadow-sm" : "hover:text-slate-950"
              }`}
            >
              Semester GPA
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("cgpa");
                setMessages([]);
              }}
              className={`rounded-md px-4 py-2 transition ${
                activeTab === "cgpa" ? "bg-white text-emerald-800 shadow-sm" : "hover:text-slate-950"
              }`}
            >
              Overall CGPA
            </button>
          </div>

          {messages.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Please check these fields:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "gpa" ? (
            <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_330px]">
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-700">Subject {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => setSubjects((rows) => rows.filter((row) => row.id !== subject.id))}
                        disabled={subjects.length === 1}
                        className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <FieldLabel label="Subject name" hint="Example: Data Structures">
                        <TextInput
                          value={subject.name}
                          onChange={(event) =>
                            setSubjects((rows) =>
                              rows.map((row) =>
                                row.id === subject.id ? { ...row, name: event.target.value } : row,
                              ),
                            )
                          }
                          placeholder="Course name"
                        />
                      </FieldLabel>
                      <FieldLabel label="Credits" hint="As listed in the syllabus.">
                        <TextInput
                          type="number"
                          min="0"
                          step="0.5"
                          value={subject.credits}
                          onChange={(event) =>
                            setSubjects((rows) =>
                              rows.map((row) =>
                                row.id === subject.id
                                  ? { ...row, credits: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="4"
                        />
                      </FieldLabel>
                      <FieldLabel label="Grade point" hint="Usually 0 to 10.">
                        <TextInput
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={subject.gradePoint}
                          onChange={(event) =>
                            setSubjects((rows) =>
                              rows.map((row) =>
                                row.id === subject.id
                                  ? { ...row, gradePoint: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="9"
                        />
                      </FieldLabel>
                      <FieldLabel label="Grade / marks" hint="Optional reference.">
                        <TextInput
                          value={subject.label}
                          onChange={(event) =>
                            setSubjects((rows) =>
                              rows.map((row) =>
                                row.id === subject.id ? { ...row, label: event.target.value } : row,
                              ),
                            )
                          }
                          placeholder="A"
                        />
                      </FieldLabel>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <SecondaryButton
                    type="button"
                    onClick={() => setSubjects((rows) => [...rows, emptySubject(nextSubjectId)])}
                  >
                    Add Subject
                  </SecondaryButton>
                  <PrimaryButton type="button" onClick={calculateGpa}>
                    Calculate GPA
                  </PrimaryButton>
                  <SecondaryButton type="button" onClick={clearRows}>
                    Clear Rows
                  </SecondaryButton>
                </div>
              </div>
              <ResultCard
                title="Semester Result"
                result={gpaResult}
                emptyText="Run the calculation after entering subject details."
              />
            </section>
          ) : (
            <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_330px]">
              <div className="space-y-3">
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-700">Semester {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => setSemesters((rows) => rows.filter((row) => row.id !== semester.id))}
                        disabled={semesters.length === 1}
                        className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <FieldLabel label="Semester name" hint="Example: Semester 1">
                        <TextInput
                          value={semester.name}
                          onChange={(event) =>
                            setSemesters((rows) =>
                              rows.map((row) =>
                                row.id === semester.id ? { ...row, name: event.target.value } : row,
                              ),
                            )
                          }
                          placeholder="Semester 1"
                        />
                      </FieldLabel>
                      <FieldLabel label="GPA" hint="Semester GPA on 10-point scale.">
                        <TextInput
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={semester.gpa}
                          onChange={(event) =>
                            setSemesters((rows) =>
                              rows.map((row) =>
                                row.id === semester.id ? { ...row, gpa: event.target.value } : row,
                              ),
                            )
                          }
                          placeholder="8.2"
                        />
                      </FieldLabel>
                      <FieldLabel label="Credits" hint="Total credits in semester.">
                        <TextInput
                          type="number"
                          min="0"
                          step="0.5"
                          value={semester.credits}
                          onChange={(event) =>
                            setSemesters((rows) =>
                              rows.map((row) =>
                                row.id === semester.id
                                  ? { ...row, credits: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="20"
                        />
                      </FieldLabel>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <SecondaryButton
                    type="button"
                    onClick={() => setSemesters((rows) => [...rows, emptySemester(nextSemesterId)])}
                  >
                    Add Semester
                  </SecondaryButton>
                  <PrimaryButton type="button" onClick={calculateCgpa}>
                    Calculate CGPA
                  </PrimaryButton>
                  <SecondaryButton type="button" onClick={clearRows}>
                    Clear Rows
                  </SecondaryButton>
                </div>
              </div>
              <ResultCard
                title="Cumulative Result"
                result={cgpaResult}
                emptyText="Run the calculation after entering semester details."
              />
            </section>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap">
            <SecondaryButton type="button" onClick={resetAll}>
              Reset Saved Data
            </SecondaryButton>
            <SecondaryButton type="button" onClick={copyResult}>
              {copied ? "Copied" : "Copy Result"}
            </SecondaryButton>
            <SecondaryButton type="button" onClick={downloadResult}>
              Download Result
            </SecondaryButton>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Percentage Converter</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Convert between GPA and percentage using the selected university reference scale.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FieldLabel label="GPA to Percentage" hint="Enter GPA or CGPA from 0 to 10.">
                <TextInput
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={converterGpa}
                  onChange={(event) => setConverterGpa(event.target.value)}
                />
                <p className="mt-2 text-sm font-medium text-emerald-800">
                  {convertedPercentage === null
                    ? "Enter a valid GPA."
                    : `${formatNumber(convertedPercentage)}%`}
                </p>
              </FieldLabel>
              <FieldLabel label="Percentage to GPA" hint="Enter academic percentage from 0 to 100.">
                <TextInput
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={converterPercentage}
                  onChange={(event) => setConverterPercentage(event.target.value)}
                />
                <p className="mt-2 text-sm font-medium text-emerald-800">
                  {convertedGpa === null ? "Enter a valid percentage." : formatNumber(convertedGpa)}
                </p>
              </FieldLabel>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Grade Point Reference</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Use this as a starting point and adjust values according to your institution.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[280px] text-left text-sm">
                <thead className="text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-8 font-medium">Grade</th>
                    <th className="py-2 font-medium">Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {gradeReference.map((item) => (
                    <tr key={item.grade}>
                      <th className="py-2 pr-8 font-medium text-slate-950">{item.grade}</th>
                      <td className="py-2">{item.point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section id="gpa-guide" className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">GPA Guide</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="rounded-lg bg-slate-50 p-4 font-mono text-sm text-slate-800">
                GPA = Sum of Credit x Grade Point / Total Credits
              </p>
              <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                <li>1. Data Structures: 4 x 9 = 36 grade points.</li>
                <li>2. Database Systems: 3 x 8 = 24 grade points.</li>
                <li>3. Operating Systems: 4 x 8.5 = 34 grade points.</li>
                <li>4. Total grade points = 94 and total credits = 11.</li>
                <li>5. GPA = 94 / 11 = 8.55.</li>
              </ol>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[520px] text-left text-sm">
                <thead className="text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-4 font-medium">Subject</th>
                    <th className="py-2 pr-4 font-medium">Credits</th>
                    <th className="py-2 pr-4 font-medium">Grade</th>
                    <th className="py-2 font-medium">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 pr-4">Data Structures</td>
                    <td className="py-2 pr-4">4</td>
                    <td className="py-2 pr-4">A</td>
                    <td className="py-2">9</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Database Systems</td>
                    <td className="py-2 pr-4">3</td>
                    <td className="py-2 pr-4">B+</td>
                    <td className="py-2">8</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Operating Systems</td>
                    <td className="py-2 pr-4">4</td>
                    <td className="py-2 pr-4">A-</td>
                    <td className="py-2">8.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="about" className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">About This Tool</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
            This calculator was developed to help students quickly estimate GPA, CGPA, and
            academic percentage using common university grading systems. Results are estimates and
            may vary depending on institution-specific rules.
          </p>
        </section>
      </div>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-slate-600 sm:px-6 lg:px-8">
          <p className="font-medium text-slate-800">Created by Aryan Mandavgode</p>
          <p>Computer Engineering Student</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a
              className="font-medium text-emerald-800 hover:text-emerald-900"
              href="https://github.com/aryonixpvtltd-commits/academic-gpa-cgpa-calculator"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository Link
            </a>
            <span>Version 1.0</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
