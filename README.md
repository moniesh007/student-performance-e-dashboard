# Student Performance Dashboard

A responsive mini-project built with **HTML, CSS, and JavaScript**. It helps a teacher or student track marks and attendance in one simple dashboard.

## Features

- Add student records with register number, attendance, and five subject marks
- Automatically calculate each student's average
- Display Pass / Needs Improvement status
- Show class average, average attendance, and student count
- Search records by student name or register number
- Delete records
- View average marks by subject in a simple bar chart
- Export student data as a CSV file
- Save records in browser `localStorage`
- Responsive layout for mobile and desktop

## Run the project

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Add sample student records and explore the dashboard.

No server or external library is required.

## Status rule

A student is marked **Pass** when their overall average is at least 40% and attendance is at least 75%. This is a demo rule; change it in `script.js` to match your institution's policy.

## Project structure

```text
student-performance-dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## GitHub upload

Create a new repository on GitHub, for example `student-performance-dashboard`. Upload these four files to the repository root, or use Git:

```bash
git init
git add .
git commit -m "Add student performance dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/student-performance-dashboard.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Future improvements

- Add login and teacher/student roles
- Store data in a database
- Add downloadable PDF reports
- Add subject-wise pass/fail details
- Connect a backend API
