let quizData;
let currentChapterIndex = 0;
let currentQuestionIndex = 0;
let currentQuestions = [];

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        quizData = data;
        populateBranchDropdown();
    });

const branchDropdown = document.getElementById("branch");
const semesterDropdown = document.getElementById("semester");
const getPyqsBtn = document.getElementById("get-pyqs-btn");
const chaptersSection = document.getElementById("chapters-section");
const chaptersList = document.getElementById("chapters-list");
const questionsSection = document.getElementById("questions-section");
const showSolutionBtn = document.getElementById("show-solution-btn");
const solutionText = document.getElementById("solution");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const questionProgress = document.getElementById("question-progress");
const homeBtn = document.getElementById("home-btn");

homeBtn.addEventListener("click", () => {
    // Go back to the home page - Show the selection section and hide the questions/chapter sections
    document.getElementById("selection-section").classList.remove("hidden");
    chaptersSection.classList.add("hidden");
    questionsSection.classList.add("hidden");
});

// Populate branch dropdown
function populateBranchDropdown() {
    const branches = Object.keys(quizData.branches);
    branchDropdown.innerHTML = `<option value="" disabled selected>-- Select Branch --</option>` +
        branches.map(branch => `<option value="${branch}">${capitalize(branch)}</option>`).join("");

    branchDropdown.addEventListener("change", populateSemesterDropdown);
}

// Populate semester dropdown
function populateSemesterDropdown() {
    const branch = branchDropdown.value;
    semesterDropdown.disabled = false;
    semesterDropdown.innerHTML = `<option value="" disabled selected>-- Select Semester --</option>`;
    const semesters = Object.keys(quizData.branches[branch].semesters);

    semesterDropdown.innerHTML += semesters.map(sem => `<option value="${sem}">${capitalize(sem)}</option>`).join("");
    getPyqsBtn.disabled = false;
}

// Handle the "Get PYQs" button click
getPyqsBtn.addEventListener("click", function () {
    const branch = branchDropdown.value;
    const semester = semesterDropdown.value;

    if (!semester) {
        alert("Please select a semester first.");
    } else {
        showChapterList(branch, semester);
    }
});

// Show chapter list and hide the selection section
function showChapterList(branch, semester) {
    const chapters = Object.keys(quizData.branches[branch].semesters[semester].chapters);

    chaptersSection.classList.remove("hidden");
    chaptersList.innerHTML = '';

    chapters.forEach(chapter => {
        const li = document.createElement("li");
        li.textContent = chapter;
        li.classList.add("p-2", "cursor-pointer", "hover:bg-gray-200", "rounded");
        li.addEventListener("click", () => {
            loadQuestions(branch, semester, chapter);
            chaptersSection.classList.add("hidden"); // Hide chapter list after selecting a chapter
        });
        chaptersList.appendChild(li);
    });

    document.getElementById("selection-section").classList.add("hidden");
}

// Load questions for the selected chapter
function loadQuestions(branch, semester, chapter) {
    currentQuestions = quizData.branches[branch].semesters[semester].chapters[chapter];
    currentChapterIndex = Object.keys(quizData.branches[branch].semesters[semester].chapters).indexOf(chapter);
    currentQuestionIndex = 0;

    displayQuestion();
    questionsSection.classList.remove("hidden"); // Show question section
}

// Display the current question
function displayQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  questionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
  document.getElementById("question-text").textContent = question.question_text;

  // Clear solution text when loading a new question
  solutionText.classList.add("hidden"); // Hide solution text
  solutionText.textContent = ''; // Clear previous solution text

  // Reset the "Show Solution" button text to "Show Solution"
  showSolutionBtn.textContent = "Show Solution";

  // Enable/Disable Prev/Next buttons
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;

  // Ensure only one event listener for showing the solution
  showSolutionBtn.removeEventListener("click", toggleSolution); 
  showSolutionBtn.addEventListener("click", toggleSolution);
}

// Show and hide solution and change the button text
function toggleSolution() {
  solutionText.classList.toggle("hidden");

  const question = currentQuestions[currentQuestionIndex];
  if (!solutionText.classList.contains("hidden")) {
      solutionText.textContent = question.solution;
      showSolutionBtn.textContent = "Hide Solution";  // Change button text to Hide Solution
  } else {
      solutionText.textContent = '';  // Reset solution when hidden
      showSolutionBtn.textContent = "Show Solution";  // Change button text back to Show Solution
  }
}


// Navigation buttons
prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--; // Update the current index
        displayQuestion(); // Simply update the question
    }
});

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++; // Update the current index
        displayQuestion(); // Simply update the question
    }
});

// Capitalize first letter of string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
