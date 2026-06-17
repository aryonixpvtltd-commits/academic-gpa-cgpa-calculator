export type SubjectRow = {
  id: number;
  name: string;
  credits: string;
  gradePoint: string;
  label: string;
};

export type SemesterRow = {
  id: number;
  name: string;
  gpa: string;
  credits: string;
};

export type GradingScaleKey = "sppu" | "mumbai" | "vtu" | "custom";

export type Result = {
  totalCredits: number;
  totalGradePoints: number;
  weightedValue: number;
  percentage: number;
  performance: string;
};

export const gradingScales: Record<
  GradingScaleKey,
  {
    label: string;
    description: string;
    toPercentage: (gpa: number) => number;
    toGpa: (percentage: number) => number;
  }
> = {
  sppu: {
    label: "SPPU (10 Point)",
    description: "Common SPPU estimate: percentage = GPA x 10 - 7.5",
    toPercentage: (gpa) => gpa * 10 - 7.5,
    toGpa: (percentage) => (percentage + 7.5) / 10,
  },
  mumbai: {
    label: "Mumbai University",
    description: "Common MU estimate: percentage = 7.25 x CGPA + 11",
    toPercentage: (gpa) => 7.25 * gpa + 11,
    toGpa: (percentage) => (percentage - 11) / 7.25,
  },
  vtu: {
    label: "VTU",
    description: "Common VTU estimate: percentage = (CGPA - 0.75) x 10",
    toPercentage: (gpa) => (gpa - 0.75) * 10,
    toGpa: (percentage) => percentage / 10 + 0.75,
  },
  custom: {
    label: "Custom Scale",
    description: "General estimate: percentage = GPA x 9.5",
    toPercentage: (gpa) => gpa * 9.5,
    toGpa: (percentage) => percentage / 9.5,
  },
};

export const sampleSubjects: SubjectRow[] = [
  { id: 1, name: "Data Structures", credits: "4", gradePoint: "9", label: "A" },
  { id: 2, name: "Database Systems", credits: "3", gradePoint: "8", label: "B+" },
  { id: 3, name: "Operating Systems", credits: "4", gradePoint: "8.5", label: "A-" },
];

export const sampleSemesters: SemesterRow[] = [
  { id: 1, name: "Semester 1", gpa: "8.2", credits: "20" },
  { id: 2, name: "Semester 2", gpa: "8.6", credits: "22" },
];

export const gradeReference = [
  { grade: "A+", point: 10 },
  { grade: "A", point: 9 },
  { grade: "B+", point: 8 },
  { grade: "B", point: 7 },
  { grade: "C", point: 6 },
  { grade: "D", point: 5 },
];

export function emptySubject(id: number): SubjectRow {
  return {
    id,
    name: "",
    credits: "",
    gradePoint: "",
    label: "",
  };
}

export function emptySemester(id: number): SemesterRow {
  return {
    id,
    name: `Semester ${id}`,
    gpa: "",
    credits: "",
  };
}

export function toNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : NaN;
}

export function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function clampGpa(value: number) {
  return Math.max(0, Math.min(10, value));
}

export function estimatePercentage(value: number, scale: GradingScaleKey) {
  return clampPercentage(gradingScales[scale].toPercentage(value));
}

export function estimateGpaFromPercentage(value: number, scale: GradingScaleKey) {
  return clampGpa(gradingScales[scale].toGpa(value));
}

export function getPerformance(value: number) {
  if (value >= 9) return "Excellent";
  if (value >= 8) return "Very Good";
  if (value >= 6.5) return "Good";
  return "Average";
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function validateSubjects(rows: SubjectRow[]) {
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

export function validateSemesters(rows: SemesterRow[]) {
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
