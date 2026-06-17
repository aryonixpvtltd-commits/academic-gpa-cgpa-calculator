"use client";

import { useMemo, useState } from "react";

type SubjectRow = {
  id: number;
  name: string;
  credits: string;
  gradePoint: string;
  label: string;
};

type SemesterRow = {
  id: number;
  name: string;
  gpa: string;
  credits: string;
};

type Result = {
  totalCredits: number;
  weightedValue: number;
  percentage: number;
  performance: string;
};

const sampleSubjects: SubjectRow[] = [
  { id: 1, name: "Mathematics", credits: "4", gradePoint: "9", label: "A" },
  { id: 2, name: "Computer Science", credits: "3", gradePoint: "8.5", label: "A-" },
  { id: 3, name: "Physics", credits: "3", gradePoint: "7.5", label: "B+" },
];

const sampleSemesters: SemesterRow[] = [
  { id: 1, name: "Semester 1", gpa: "8.2", credits: "20" },
  { id: 2, name: "Semester 2", gpa: "8.7", credits: "22" },
];

const emptySubject = (id: number): SubjectRow => ({
  id,
  name: "",
  credits: "",
  gradePoint: "",
  label: "",
});

const emptySemester = (id: number): SemesterRow => ({
  id,
  name: `Semester ${id}`,
  gpa: "",
  credits: "",
});

function toNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : NaN;
}

function getPerformance(value: number) {
  if (value >= 8.5) return "Excellent";
  if (value >= 7) return "Good";
  if (value >= 5.5) return "Average";
  return "Needs Improvement";
}

function estimatePercentage(value: number) {
  return Math.max(0, Math.min(100, value * 9.5));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function validateSubjects(rows: SubjectRow[]) {
  const messages: string[] = [];
  const validRows = rows
    .map((row) => ({
      ...row,
      creditsNumber: toNumber(row.credits),
      gradePointNumber: toNumber(row.gradePoint),
    }))
    .filter((row) => row.name.trim() || row.credits.trim() || row.gradePoint.trim() || row.label.trim());

  if (validRows.length === 0) {
    messages.push("Add at least one subject with credits and grade point.");
  }

  validRows.forEach((row, index) => {
    const name = row.name.trim() || `Subject ${index + 1}`;
    if (!Number.isFinite(row.creditsNumber) || row.creditsNumber <= 0) {
      messages.push(`${name}: credits must be greater than 0.`);
    }
    if (
      !Number.isFinite(row.gradePointNumber) ||
      row.gradePointNumber < 0 ||
      row.gradePointNumber > 10
    ) {
      messages.push(`${name}: grade point must be between 0 and 10.`);
    }
  });

  return { messages, validRows };
}

function validateSemesters(rows: SemesterRow[]) {
  const messages: string[] = [];
  const validRows = rows
    .map((row) => ({
      ...row,
      gpaNumber: toNumber(row.gpa),
      creditsNumber: toNumber(row.credits),
    }))
    .filter((row) => row.name.trim() || row.gpa.trim() || row.credits.trim());

  if (validRows.length === 0) {
    messages.push("Add at least one semester with GPA and credits.");
  }

  validRows.forEach((row, index) => {
    const name = row.name.trim() || `Semester ${index + 1}`;
    if (!Number.isFinite(row.gpaNumber) || row.gpaNumber < 0 || row.gpaNumber > 10) {
      messages.push(`${name}: GPA must be between 0 and 10.`);
    }
    if (!Number.isFinite(row.creditsNumber) || row.creditsNumber <= 0) {
      messages.push(`${name}: credits must be greater than 0.`);
    }
  });

  return { messages, validRows };
}

function FieldLabel({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {children}
      <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span>
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {result ? "Based on the values entered below." : emptyText}
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          10 point scale
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric label="Total credits" value={result ? formatNumber(result.totalCredits) : "-"} />
        <Metric label={title.includes("CGPA") ? "CGPA" : "Weighted GPA"} value={result ? formatNumber(result.weightedValue) : "-"} />
        <Metric label="Approx. percentage" value={result ? `${formatNumber(result.percentage)}%` : "-"} />
        <Metric label="Performance" value={result?.performance ?? "-"} />
      </div>
      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
        Results are estimates. Different universities may use different grading scales and
        percentage conversion methods.
      </p>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-300"
    />
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
    />
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gpa" | "cgpa">("gpa");
  const [subjects, setSubjects] = useState(sampleSubjects);
  const [semesters, setSemesters] = useState(sampleSemesters);
  const [gpaResult, setGpaResult] = useState<Result | null>(null);
  const [cgpaResult, setCgpaResult] = useState<Result | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const nextSubjectId = useMemo(() => Math.max(0, ...subjects.map((row) => row.id)) + 1, [subjects]);
  const nextSemesterId = useMemo(() => Math.max(0, ...semesters.map((row) => row.id)) + 1, [semesters]);

  function calculateGpa() {
    const { messages: validationMessages, validRows } = validateSubjects(subjects);
    if (validationMessages.length) {
      setMessages(validationMessages);
      setGpaResult(null);
      return;
    }

    const totalCredits = validRows.reduce((sum, row) => sum + row.creditsNumber, 0);
    const weightedGpa =
      validRows.reduce((sum, row) => sum + row.creditsNumber * row.gradePointNumber, 0) /
      totalCredits;

    setMessages([]);
    setGpaResult({
      totalCredits,
      weightedValue: weightedGpa,
      percentage: estimatePercentage(weightedGpa),
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
    const cgpa =
      validRows.reduce((sum, row) => sum + row.creditsNumber * row.gpaNumber, 0) / totalCredits;

    setMessages([]);
    setCgpaResult({
      totalCredits,
      weightedValue: cgpa,
      percentage: estimatePercentage(cgpa),
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
    setActiveTab("gpa");
  }

  function clearSamples() {
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
      `Total credits: ${formatNumber(activeResult.totalCredits)}`,
      `${activeTab === "gpa" ? "Weighted GPA" : "CGPA"}: ${formatNumber(activeResult.weightedValue)}`,
      `Approx. percentage: ${formatNumber(activeResult.percentage)}%`,
      `Performance: ${activeResult.performance}`,
      "",
      "Formula: GPA = Sum of Credit × Grade Point / Total Credits",
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
    <main className="min-h-screen bg-[#f6f7f4] text-slate-950">
      <header className="border-b border-slate-200 bg-[#f6f7f4]/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a className="text-sm font-semibold text-slate-800" href="#calculator">
              Student Calculator
            </a>
            <a
              href="https://digitalheroesco.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              Built for Digital Heroes
            </a>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Academic GPA & CGPA Calculator
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Calculate semester GPA and overall CGPA using your university&apos;s grading system.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section id="calculator" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Calculator</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Use grade points on a 10-point scale. If your university uses a different scale, convert the grade point before entering it.
              </p>
            </div>
            <div className="grid rounded-xl bg-slate-100 p-1 text-sm font-semibold text-slate-600 sm:w-fit sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("gpa");
                  setMessages([]);
                }}
                className={`rounded-lg px-4 py-2 transition ${
                  activeTab === "gpa" ? "bg-white text-sky-800 shadow-sm" : "hover:text-slate-950"
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
                className={`rounded-lg px-4 py-2 transition ${
                  activeTab === "cgpa" ? "bg-white text-sky-800 shadow-sm" : "hover:text-slate-950"
                }`}
              >
                Overall CGPA
              </button>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Please check these fields:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "gpa" ? (
            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="space-y-4">
                  {subjects.map((subject, index) => (
                    <div key={subject.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
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
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                        <FieldLabel label="Credits" hint="Use the credit value from your syllabus.">
                          <TextInput
                            type="number"
                            min="0"
                            step="0.5"
                            value={subject.credits}
                            onChange={(event) =>
                              setSubjects((rows) =>
                                rows.map((row) =>
                                  row.id === subject.id ? { ...row, credits: event.target.value } : row,
                                ),
                              )
                            }
                            placeholder="4"
                          />
                        </FieldLabel>
                        <FieldLabel label="Grade point" hint="Enter 0 to 10, not the letter grade.">
                          <TextInput
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={subject.gradePoint}
                            onChange={(event) =>
                              setSubjects((rows) =>
                                rows.map((row) =>
                                  row.id === subject.id ? { ...row, gradePoint: event.target.value } : row,
                                ),
                              )
                            }
                            placeholder="8.5"
                          />
                        </FieldLabel>
                        <FieldLabel label="Marks / grade label" hint="Optional, for your reference only.">
                          <TextInput
                            value={subject.label}
                            onChange={(event) =>
                              setSubjects((rows) =>
                                rows.map((row) =>
                                  row.id === subject.id ? { ...row, label: event.target.value } : row,
                                ),
                              )
                            }
                            placeholder="A or 82%"
                          />
                        </FieldLabel>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <SecondaryButton type="button" onClick={() => setSubjects((rows) => [...rows, emptySubject(nextSubjectId)])}>
                    Add Subject
                  </SecondaryButton>
                  <PrimaryButton type="button" onClick={calculateGpa}>
                    Calculate GPA
                  </PrimaryButton>
                  <SecondaryButton type="button" onClick={clearSamples}>
                    Clear sample rows
                  </SecondaryButton>
                </div>
              </div>
              <ResultCard title="Semester GPA Result" result={gpaResult} emptyText="Calculate once your subject rows are ready." />
            </section>
          ) : (
            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="space-y-4">
                  {semesters.map((semester, index) => (
                    <div key={semester.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
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
                      <div className="grid gap-4 md:grid-cols-3">
                        <FieldLabel label="Semester name" hint="Use any label that helps you remember it.">
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
                        <FieldLabel label="GPA" hint="Enter semester GPA on a 10-point scale.">
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
                        <FieldLabel label="Credits" hint="Use total semester credits.">
                          <TextInput
                            type="number"
                            min="0"
                            step="0.5"
                            value={semester.credits}
                            onChange={(event) =>
                              setSemesters((rows) =>
                                rows.map((row) =>
                                  row.id === semester.id ? { ...row, credits: event.target.value } : row,
                                ),
                              )
                            }
                            placeholder="20"
                          />
                        </FieldLabel>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <SecondaryButton type="button" onClick={() => setSemesters((rows) => [...rows, emptySemester(nextSemesterId)])}>
                    Add Semester
                  </SecondaryButton>
                  <PrimaryButton type="button" onClick={calculateCgpa}>
                    Calculate CGPA
                  </PrimaryButton>
                  <SecondaryButton type="button" onClick={clearSamples}>
                    Clear sample rows
                  </SecondaryButton>
                </div>
              </div>
              <ResultCard title="Overall CGPA Result" result={cgpaResult} emptyText="Calculate once your semester rows are ready." />
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap">
            <SecondaryButton type="button" onClick={resetAll}>
              Reset
            </SecondaryButton>
            <SecondaryButton type="button" onClick={copyResult}>
              {copied ? "Copied" : "Copy result"}
            </SecondaryButton>
            <SecondaryButton type="button" onClick={downloadResult}>
              Download result as text file
            </SecondaryButton>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Formula & Example</h2>
            <p className="mt-4 rounded-xl bg-slate-50 p-4 font-mono text-sm text-slate-800">
              GPA = Sum of Credit × Grade Point / Total Credits
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[520px] text-left text-sm">
                <thead className="text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-4 font-medium">Subject</th>
                    <th className="py-2 pr-4 font-medium">Credits</th>
                    <th className="py-2 pr-4 font-medium">Grade</th>
                    <th className="py-2 font-medium">Grade point</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4">Data Structures</td>
                    <td className="py-2 pr-4">4</td>
                    <td className="py-2 pr-4">A</td>
                    <td className="py-2">9</td>
                  </tr>
                  <tr className="border-b border-slate-100">
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
            <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              <li>1. Multiply credits by grade point: 4×9 = 36, 3×8 = 24, 4×8.5 = 34.</li>
              <li>2. Add weighted points: 36 + 24 + 34 = 94.</li>
              <li>3. Add credits: 4 + 3 + 4 = 11.</li>
              <li>4. Divide weighted points by credits: 94 / 11 = 8.55 GPA.</li>
            </ol>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Grading Scale Reference</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This is a common 10-point reference. Adjust grade points according to your
              institution&apos;s official grading rules.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[360px] text-left text-sm">
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    ["A+", "10"],
                    ["A", "9"],
                    ["B+", "8"],
                    ["B", "7"],
                    ["C", "6"],
                    ["D", "5"],
                  ].map(([grade, point]) => (
                    <tr key={grade}>
                      <th className="py-2 pr-8 font-medium text-slate-950">{grade}</th>
                      <td className="py-2">{point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">About GPA and CGPA</h2>
          <div className="mt-4 grid gap-5 text-sm leading-6 text-slate-600 md:grid-cols-2">
            <p>
              GPA usually means Grade Point Average for one semester or term. It combines each
              course&apos;s grade point with its credit value, so higher-credit subjects have more
              effect on the final result.
            </p>
            <p>
              CGPA means Cumulative Grade Point Average. It combines multiple semester GPAs using
              semester credits, giving a broader view of academic performance across terms.
            </p>
            <p>
              The calculator uses a weighted average: credit multiplied by grade point, divided by
              total credits. The same weighted method is used for overall CGPA.
            </p>
            <p>
              Universities may define grades, credits, and percentage conversions differently, so
              treat the percentage estimate as a helpful reference rather than an official value.
            </p>
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            Built by Aryan Mandavgode for students worldwide.
            <span className="mx-2 text-slate-300">|</span>
            <a className="font-medium text-sky-800 hover:text-sky-900" href="mailto:aryanmandavgode@gmail.com">
              aryanmandavgode@gmail.com
            </a>
            <span className="mx-2 text-slate-300">|</span>
            Last Updated 2026
          </p>
          <a
            href="https://digitalheroesco.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-800 hover:text-emerald-900"
          >
            Built for Digital Heroes
          </a>
        </div>
      </footer>
    </main>
  );
}
