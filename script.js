const STORAGE_KEY = "student-performance-dashboard-v1";
const subjects = [
  { key: "maths", label: "Mathematics" },
  { key: "programming", label: "Programming" },
  { key: "cs", label: "Computer Science" },
  { key: "english", label: "English" },
  { key: "statistics", label: "Statistics" }
];

const form = document.getElementById("studentForm");
const rows = document.getElementById("studentRows");
const searchInput = document.getElementById("searchInput");
const formMessage = document.getElementById("formMessage");
let students = loadStudents();

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function average(student) {
  return subjects.reduce((sum, subject) => sum + Number(student[subject.key]), 0) / subjects.length;
}

function statusFor(student) {
  return average(student) >= 40 && Number(student.attendance) >= 75 ? "Pass" : "Needs Improvement";
}

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function render() {
  const total = students.length;
  const classAverage = total ? students.reduce((sum, s) => sum + average(s), 0) / total : 0;
  const attendance = total ? students.reduce((sum, s) => sum + Number(s.attendance), 0) / total : 0;
  document.getElementById("totalStudents").textContent = total;
  document.getElementById("classAverage").textContent = `${classAverage.toFixed(1)}%`;
  document.getElementById("avgAttendance").textContent = `${attendance.toFixed(1)}%`;
  document.getElementById("needsHelp").textContent = students.filter(s => statusFor(s) !== "Pass").length;

  const query = searchInput.value.trim().toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query) || s.regNo.toLowerCase().includes(query)
  );

  rows.innerHTML = filtered.map(s => {
    const avg = average(s);
    const status = statusFor(s);
    return `<tr>
      <td><span class="student-name">${safeText(s.name)}</span></td>
      <td>${safeText(s.regNo)}</td>
      <td><strong>${avg.toFixed(1)}%</strong></td>
      <td>${Number(s.attendance)}%</td>
      <td><span class="status ${status === "Pass" ? "pass" : "help"}">${status}</span></td>
      <td><button class="delete-btn" data-delete="${safeText(s.id)}" aria-label="Delete ${safeText(s.name)}">Delete</button></td>
    </tr>`;
  }).join("");

  document.getElementById("emptyState").hidden = filtered.length > 0;
  renderChart();
}

function renderChart() {
  const chart = document.getElementById("subjectChart");
  if (!students.length) {
    chart.innerHTML = '<p class="empty-state">Subject averages will appear after you add student records.</p>';
    return;
  }
  chart.innerHTML = subjects.map(subject => {
    const avg = students.reduce((sum, s) => sum + Number(s[subject.key]), 0) / students.length;
    return `<div class="bar-row">
      <span>${subject.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(0, Math.min(100, avg))}%"></div></div>
      <span class="bar-value">${avg.toFixed(1)}</span>
    </div>`;
  }).join("");
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const student = {
    id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    name: String(data.get("name")).trim(),
    regNo: String(data.get("regNo")).trim(),
    attendance: Number(data.get("attendance"))
  };
  for (const subject of subjects) student[subject.key] = Number(data.get(subject.key));

  if (!student.name || !student.regNo) {
    formMessage.textContent = "Please enter the student's name and register number.";
    return;
  }
  if (students.some(s => s.regNo.toLowerCase() === student.regNo.toLowerCase())) {
    formMessage.textContent = "That register number already exists.";
    return;
  }
  if ([student.attendance, ...subjects.map(s => student[s.key])].some(n => !Number.isFinite(n) || n < 0 || n > 100)) {
    formMessage.textContent = "Marks and attendance must be between 0 and 100.";
    return;
  }

  students.unshift(student);
  saveStudents();
  form.reset();
  document.getElementById("attendance").value = 90;
  formMessage.textContent = "Student added successfully.";
  render();
  setTimeout(() => { formMessage.textContent = ""; }, 2500);
});

rows.addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  students = students.filter(s => s.id !== button.dataset.delete);
  saveStudents();
  render();
});

searchInput.addEventListener("input", render);

document.getElementById("exportBtn").addEventListener("click", () => {
  if (!students.length) {
    alert("Add at least one student before exporting.");
    return;
  }
  const headers = ["Name", "Register Number", "Attendance", ...subjects.map(s => s.label), "Average", "Status"];
  const csvCell = value => `"${String(value).replace(/"/g, '""')}"`;
  const lines = [headers, ...students.map(s => [
    s.name, s.regNo, s.attendance, ...subjects.map(subject => s[subject.key]),
    average(s).toFixed(1), statusFor(s)
  ])].map(row => row.map(csvCell).join(","));
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-performance.csv";
  link.click();
  URL.revokeObjectURL(url);
});

render();
