import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academic GPA & CGPA Calculator",
  description:
    "Academic GPA and CGPA calculator for students with university grading scales, percentage conversion, credits, and performance estimates.",
  keywords: [
    "GPA calculator",
    "CGPA calculator",
    "academic calculator",
    "semester GPA",
    "student GPA tool",
    "credit grade calculator",
    "SPPU GPA calculator",
    "VTU CGPA calculator",
  ],
  openGraph: {
    title: "Academic GPA & CGPA Calculator",
    description:
      "Academic GPA and CGPA calculator for students with university grading scales, percentage conversion, credits, and performance estimates.",
    type: "website",
    url: "https://academic-gpa-cgpa-calculator.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "Academic GPA & CGPA Calculator",
    description:
      "Academic GPA and CGPA calculator for students with university grading scales, percentage conversion, credits, and performance estimates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
