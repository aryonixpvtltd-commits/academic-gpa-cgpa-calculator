# Academic GPA & CGPA Calculator

A clean, responsive, client-side web app that helps students calculate semester GPA, overall CGPA, total credits, approximate percentage, and academic performance.

The project is built as a practical student utility website with a light, readable interface inspired by modern university portals. It does not require authentication, a database, paid APIs, or a backend server.

## Project Overview

The Academic GPA & CGPA Calculator lets students enter course credits and grade points to estimate their semester GPA. Students can also enter multiple semester GPAs and credits to calculate their overall CGPA.

Because grading systems vary across universities, the app includes a grading scale reference, realistic academic examples, and a disclaimer explaining that percentage conversions are estimates.

## Features

- Semester GPA calculator with editable subject rows
- Overall CGPA calculator with editable semester rows
- Add, remove, and clear sample rows
- Total credits calculation
- Weighted GPA and CGPA calculation
- Approximate percentage estimate
- Performance label: Excellent, Good, Average, or Needs Improvement
- Clear validation messages for invalid credits or grade points
- Copy result button
- Download result as a text file
- Reset button
- Formula explanation and step-by-step academic example
- Grading scale reference card
- About section explaining GPA, CGPA, and grading-scale differences
- Mobile responsive layout with horizontal scrolling tables
- SEO metadata and custom favicon
- Ready for Vercel deployment

## GPA Formula

```text
GPA = Sum of Credit × Grade Point / Total Credits
```

Example:

| Subject | Credits | Grade | Grade Point |
| --- | ---: | --- | ---: |
| Data Structures | 4 | A | 9 |
| Database Systems | 3 | B+ | 8 |
| Operating Systems | 4 | A- | 8.5 |

Step-by-step:

```text
Data Structures: 4 × 9 = 36
Database Systems: 3 × 8 = 24
Operating Systems: 4 × 8.5 = 34

Total weighted points = 36 + 24 + 34 = 94
Total credits = 4 + 3 + 4 = 11

GPA = 94 / 11 = 8.55
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Fully client-side React state
- No backend
- No database
- No authentication

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Build

Run the production build:

```bash
npm run build
```

Optional lint check:

```bash
npm run lint
```

## Screenshots

Add screenshots here after deploying or running the app locally.

Suggested screenshots:

- Desktop view of the Semester GPA calculator
- Desktop view of the Overall CGPA calculator
- Mobile view of the calculator
- Formula, example, and grading scale section

```md
![Desktop GPA Calculator](./screenshots/desktop-gpa.png)
![Mobile GPA Calculator](./screenshots/mobile-gpa.png)
```

## Deployment

This project is ready to deploy on Vercel.

Steps:

1. Push the project to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Select **New Project**.
4. Import the GitHub repository.
5. Keep the default Next.js build settings.
6. Deploy.

Default Vercel settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

No environment variables are required.

## Author

Built by Aryan Mandavgode for students worldwide.

Email: [aryanmandavgode@gmail.com](mailto:aryanmandavgode@gmail.com)

Website link included in the app: [Built for Digital Heroes](https://digitalheroesco.com/)

## Notes

This project was built as a free trial task for Digital Heroes.

Results are estimates. Different universities may use different grading scales and percentage conversion methods.
