
// Handles student form submissions, table rendering, localStorage persistence,
// search, and delete operations.

(function () {
  const STORAGE_KEY = 'student_records_v1';

  // Cached DOM elements
 // Finds the add student form
  const form = document.getElementById('student-form');
  // Finds the name input field
  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const classInput = document.getElementById('class');
  const imageUrlInput = document.getElementById('image-url');
  const score1Input = document.getElementById('score1');
  const score2Input = document.getElementById('score2');
  const score3Input = document.getElementById('score3');
   // Finds the table area
  const tableBody = document.querySelector('#student-table tbody');
 // Finds the search bar
  const searchInput = document.getElementById('search');

  let students = loadStudents();

  //compute average of numeric values, returns number with 2 decimals
  function computeAverage(scores) {
// Converts scores to numbers and removes any non-numeric ones

    const valid = scores.map(Number).filter(n => !Number.isNaN(n));
// If no valid scores, average is 0
    if (valid.length === 0) return 0;
    // add all  valid score
    const sum = valid.reduce((a, b) => a + b, 0);
  // div sum by count
    return +(sum / valid.length).toFixed(2);
  }

  function performanceLabel(avg) {
    if (avg >= 85) return 'Excellent';
    if (avg >= 70) return 'Good';
    if (avg >= 50) return 'Average';
    return 'Needs Improvement';
  }

  // Persist students array to localStorage
//Preparing Our Data for LocalStorage (JSON.stringify)
  function saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); //Convert our 'students' array into a single text string
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }
//Retrieving Data from LocalStorage (JSON.parse)
  // Load students from localStorage
  function loadStudents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
// If there's no saved data, start with an empty list.
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
      return [];
    }
  }

  // Render the table rows given current students and filter (search)
  function renderTable(filter = '') {
// Prepare search filter
    const q = filter.trim().toLowerCase();
     // <-- Clears the table body!
    tableBody.innerHTML = '';
//filtering student for search
    students
      .filter(s => s.name.toLowerCase().includes(q))
      .forEach((student, idx) => {
  // building each student roll
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
// Calculate the average score for the student
        const avg = computeAverage([student.score1, student.score2, student.score3]);
// Create a table cell for the average
        const avgTd = document.createElement('td');
// put average text into the cell
        avgTd.textContent = avg;
 // Determine the performance label based on the average
// Create a table cell for the label
     const perfTd = document.createElement('td');
 // Put the label text into the cell
 // display the performance label      
 perfTd.textContent = performanceLabel(avg);
// Cell for action buttons
        const actionTd = document.createElement('td');
// Create a new button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.type = 'button';
        delBtn.dataset.index = idx; // index in filtered list
        delBtn.addEventListener('click', () => handleDelete(student.id));
        actionTd.appendChild(delBtn);
// Assembling the Row and Adding to Table
        tr.appendChild(imgTd);
        tr.appendChild(nameTd);
        tr.appendChild(classTd);
        tr.appendChild(avgTd);
        tr.appendChild(perfTd);
        tr.appendChild(actionTd);
 // <-- Add the complete row to the table!
        tableBody.appendChild(tr);
      });
  }

  // Create a student object with a unique id
  function createStudent({ name, age, className, imageUrl, score1, score2, score3 }) {
    return {
  // Generates a unique ID
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
  // Cleans up extra spaces 
      name: name.trim(),
  // Converts age to a number
      age: Number(age) || null,
      className: className.trim(),
      imageUrl: imageUrl.trim(),
  // Converts score to a number, defaults to 
      score1: Number(score1) || 0,
      score2: Number(score2) || 0,
      score3: Number(score3) || 0
    };
  }

  // Handle form submission
  function handleSubmit(e) {
  // Stops the page from refreshing
    e.preventDefault();
    const data = {
  // Collects values from the form inputs
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
// Here, createStudent() is called!
    const student = createStudent(data);
//add new student to our list
    students.push(student);
  //save new students
    saveStudents();
// display new student
    renderTable(searchInput.value || '');
    // Clears the form fields
    form.reset();
  }

  // Delete student by id
  function handleDelete(id) {
    // find position of the student with the id
    const index = students.findIndex(s => s.id === id);
    // If student not found, stop here
    if (index === -1) return;
    // Ask for confirmation before deleting
    if (!confirm(`Delete student "${students[index].name}"?`)) return;
    students.splice(index, 1);
    saveStudents();
    renderTable(searchInput.value || '');
  }

  // Wire up events
  if (form) form.addEventListener('submit', handleSubmit);
  if (searchInput) searchInput.addEventListener('input', () => renderTable(searchInput.value));

  // Initial render when the page loads
  document.addEventListener('DOMContentLoaded', () => renderTable(''));

  // Expose for debugging (optional)
  window._studentTracker = {
    students,
    save: saveStudents,
    load: () => { students = loadStudents(); renderTable(''); }
  };

})();
