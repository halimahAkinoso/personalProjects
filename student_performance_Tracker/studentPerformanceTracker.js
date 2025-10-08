
// Handles student form submissions, table rendering, localStorage persistence,
// search, and delete operations.

(function () {
  const STORAGE_KEY = 'student_records_v1';

  // Cached DOM elements
  const form = document.getElementById('student-form');
  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const classInput = document.getElementById('class');
  const imageUrlInput = document.getElementById('image-url');
  const score1Input = document.getElementById('score1');
  const score2Input = document.getElementById('score2');
  const score3Input = document.getElementById('score3');
  const tableBody = document.querySelector('#student-table tbody');
  const searchInput = document.getElementById('search');

  let students = loadStudents();

  // Utility: compute average of numeric values, returns number with 2 decimals
  function computeAverage(scores) {
    const valid = scores.map(Number).filter(n => !Number.isNaN(n));
    if (valid.length === 0) return 0;
    const sum = valid.reduce((a, b) => a + b, 0);
    return +(sum / valid.length).toFixed(2);
  }

  function performanceLabel(avg) {
    if (avg >= 85) return 'Excellent';
    if (avg >= 70) return 'Good';
    if (avg >= 50) return 'Average';
    return 'Needs Improvement';
  }

  // Persist students array to localStorage
  function saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }

  // Load students from localStorage
  function loadStudents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
      return [];
    }
  }

  // Render the table rows given current students and filter (search)
  function renderTable(filter = '') {
    const q = filter.trim().toLowerCase();
    tableBody.innerHTML = '';

    students
      .filter(s => s.name.toLowerCase().includes(q))
      .forEach((student, idx) => {
        const tr = document.createElement('tr');

        const imgTd = document.createElement('td');
        const img = document.createElement('img');
        img.src = student.imageUrl || '';
        img.alt = student.name;
        img.width = 60;
        img.height = 60;
        img.style.objectFit = 'cover';
        imgTd.appendChild(img);

        const nameTd = document.createElement('td');
        nameTd.textContent = student.name;

        const classTd = document.createElement('td');
        classTd.textContent = student.className || '';

        const avg = computeAverage([student.score1, student.score2, student.score3]);
        const avgTd = document.createElement('td');
        avgTd.textContent = avg;

        const perfTd = document.createElement('td');
        perfTd.textContent = performanceLabel(avg);

        const actionTd = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.type = 'button';
        delBtn.dataset.index = idx; // index in filtered list
        delBtn.addEventListener('click', () => handleDelete(student.id));
        actionTd.appendChild(delBtn);

        tr.appendChild(imgTd);
        tr.appendChild(nameTd);
        tr.appendChild(classTd);
        tr.appendChild(avgTd);
        tr.appendChild(perfTd);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
      });
  }

  // Create a student object with a unique id
  function createStudent({ name, age, className, imageUrl, score1, score2, score3 }) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      age: Number(age) || null,
      className: className.trim(),
      imageUrl: imageUrl.trim(),
      score1: Number(score1) || 0,
      score2: Number(score2) || 0,
      score3: Number(score3) || 0
    };
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: nameInput.value,
      age: ageInput.value,
      className: classInput.value,
      imageUrl: imageUrlInput.value,
      score1: score1Input.value,
      score2: score2Input.value,
      score3: score3Input.value
    };

    // Basic validation
    if (!data.name) {
      alert('Please enter a name');
      return;
    }

    const student = createStudent(data);
    students.push(student);
    saveStudents();
    renderTable(searchInput.value || '');
    form.reset();
  }

  // Delete student by id
  function handleDelete(id) {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return;
    if (!confirm(`Delete student "${students[index].name}"?`)) return;
    students.splice(index, 1);
    saveStudents();
    renderTable(searchInput.value || '');
  }

  // Wire up events
  if (form) form.addEventListener('submit', handleSubmit);
  if (searchInput) searchInput.addEventListener('input', () => renderTable(searchInput.value));

  // Initial render
  document.addEventListener('DOMContentLoaded', () => renderTable(''));

  // Expose for debugging (optional)
  window._studentTracker = {
    students,
    save: saveStudents,
    load: () => { students = loadStudents(); renderTable(''); }
  };

})();
