# Academic GPA & CGPA Calculator

A responsive academic utility website for calculating semester GPA, cumulative CGPA, estimated percentage, and performance labels using common university grading systems.

This project is designed to look and feel like a realistic student project built by a Computer Engineering student for an internship assessment. It is fully client-side and does not require a backend, database, authentication, or paid API.

## Project Overview

The Academic GPA & CGPA Calculator helps students enter subject credits, grade points, semester GPAs, and semester credits to estimate academic performance. It includes university grading scale presets, a percentage converter, a grade point reference table, recent calculation history, and automatic browser-based saving through local storage.

Supported grading references:

- SPPU (10 Point)
- Mumbai University
- VTU
- Custom Scale

Results are estimates and may vary depending on institution-specific grading and conversion rules.

## Features

- Semester GPA calculator with editable subject rows
- Overall CGPA calculator with editable semester rows
- University grading scale dropdown
- GPA to percentage converter
- Percentage to GPA converter
- Grade point reference table
- Recent calculations history with one-click restore
- Last 5 GPA or CGPA calculations saved in local storage
- Total credits calculation
- Total grade points calculation
- Estimated percentage based on selected grading scale
- Performance label: Outstanding, Excellent, Very Good, Good, Average, or Needs Improvement
- Clear validation messages
- Automatic local storage saving and restore on page reload
- Copy result button
- Download result as a text file
- Reset saved data button
- Academic guide with step-by-step GPA example
- Documentation-style About section with purpose, supported systems, methodology, and disclaimer
- Mobile, tablet, and desktop responsive layout

## GPA Formula

```text
GPA = Sum of Credit x Grade Point / Total Credits
```

Example:

| Subject | Credits | Grade | Grade Point |
| --- | ---: | --- | ---: |
| Data Structures | 4 | A | 9 |
| Database Systems | 3 | B+ | 8 |
| Operating Systems | 4 | A- | 8.5 |

Step-by-step:

```text
Data Structures: 4 x 9 = 36
Database Systems: 3 x 8 = 24
Operating Systems: 4 x 8.5 = 34

Total grade points = 36 + 24 + 34 = 94
Total credits = 4 + 3 + 4 = 11

GPA = 94 / 11 = 8.55
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React client-side state
- Browser local storage

## Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Screenshots

Add project screenshots after running or deploying the app.

Suggested screenshots:

- Desktop calculator view
- CGPA calculator tab
- Percentage converter and grade reference
- Mobile layout

```md
![Desktop Calculator](./screenshots/desktop-calculator.png)
![Mobile Calculator](./screenshots/mobile-calculator.png)
```

## Deployment

This project can be deployed directly to Vercel.

1. Push the repository to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Create a new project.
4. Import the GitHub repository.
5. Keep the default Next.js settings.
6. Deploy.

Recommended Vercel settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

No environment variables are required.

## Repository

[GitHub Repository Link](https://github.com/aryonixpvtltd-commits/academic-gpa-cgpa-calculator)

## Author

Created by Aryan Mandavgode  
Computer Engineering Student

Academic GPA & CGPA Calculator v1.0  
Last Updated: June 2026
