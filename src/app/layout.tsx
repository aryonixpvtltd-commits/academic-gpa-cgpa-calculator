import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academic GPA & CGPA Calculator",
  description:
    "Free GPA and CGPA calculator for students. Calculate semester GPA, overall CGPA, credits, and academic performance instantly.",
  keywords: [
    "GPA calculator",
    "CGPA calculator",
    "academic calculator",
    "semester GPA",
    "student GPA tool",
    "credit grade calculator",
  ],
  openGraph: {
    title: "Academic GPA & CGPA Calculator",
    description:
      "Free GPA and CGPA calculator for students. Calculate semester GPA, overall CGPA, credits, and academic performance instantly.",
    type: "website",
    url: "https://academic-gpa-cgpa-calculator.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "Academic GPA & CGPA Calculator",
    description:
      "Free GPA and CGPA calculator for students. Calculate semester GPA, overall CGPA, credits, and academic performance instantly.",
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
