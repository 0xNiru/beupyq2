function typesetMathJax() {
MathJax.Hub.Typeset(document.getElementById("questions-section"));
}

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
    document.getElementById("selection-section").classList.remove("hidden");
    chaptersSection.classList.add("hidden");
    questionsSection.classList.add("hidden");
});

function populateBranchDropdown() {
    const branches = Object.keys(quizData.branches);
    branchDropdown.innerHTML = `<option value="" disabled selected>-- Select Branch --</option>` +
        branches.map(branch => `<option value="${branch}">${capitalize(branch)}</option>`).join("");

    branchDropdown.addEventListener("change", populateSemesterDropdown);
}

function populateSemesterDropdown() {
    const branch = branchDropdown.value;
    semesterDropdown.disabled = false;
    semesterDropdown.innerHTML = `<option value="" disabled selected>-- Select Semester --</option>`;
    const semesters = Object.keys(quizData.branches[branch].semesters);

    semesterDropdown.innerHTML += semesters.map(sem => `<option value="${sem}">${capitalize(sem)}</option>`).join("");
    getPyqsBtn.disabled = false;
}

getPyqsBtn.addEventListener("click", function () {
    const branch = branchDropdown.value;
    const semester = semesterDropdown.value;

    if (!semester) {
        alert("Please select a semester first.");
    } else {
        showChapterList(branch, semester);
    }
});

function showChapterList(branch, semester) {
    const chapters = Object.keys(quizData.branches[branch].semesters[semester].chapters);

    chaptersSection.classList.remove("hidden");
    chaptersList.innerHTML = '';

    chapters.forEach(chapter => {
        const li = document.createElement("li");
        li.textContent = chapter;
        li.classList.add("p-2", "cursor-pointer", "hover:bg-gray-700", "rounded", "text-gray-200");
        li.addEventListener("click", () => {
            loadQuestions(branch, semester, chapter);
            chaptersSection.classList.add("hidden");
        });
        chaptersList.appendChild(li);
    });

    document.getElementById("selection-section").classList.add("hidden");
}

function loadQuestions(branch, semester, chapter) {
    currentQuestions = quizData.branches[branch].semesters[semester].chapters[chapter];
    currentChapterIndex = Object.keys(quizData.branches[branch].semesters[semester].chapters).indexOf(chapter);
    currentQuestionIndex = 0;

    displayQuestion();
    typesetMathJax();
    questionsSection.classList.remove("hidden");
}

function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    
    const questionContainer = document.getElementById("question-text");
    const answerContainer = document.createElement("div");
    answerContainer.id = "answer-container";
    answerContainer.className = "mt-4";

    // Clear previous content
    questionContainer.textContent = question.question_text;
    const oldAnswerContainer = document.getElementById("answer-container");
    if (oldAnswerContainer) oldAnswerContainer.remove();
    
    // Reset solution
    solutionText.classList.add("hidden");
    solutionText.textContent = '';
    
    // Add new answer container after question text
    questionContainer.parentNode.insertBefore(answerContainer, showSolutionBtn);

    // Handle different question types
    switch(question.question_type) {
        case "objective":
            createObjectiveQuestion(question, answerContainer);
            showSolutionBtn.classList.add("hidden");
            break;
        case "numerical":
            createNumericalQuestion(question, answerContainer);
            showSolutionBtn.classList.add("hidden");
            break;
        case "subjective":
            createSubjectiveQuestion(answerContainer);
            showSolutionBtn.classList.remove("hidden");
            break;
        default:
            createSubjectiveQuestion(answerContainer);
            showSolutionBtn.classList.remove("hidden");
    }

    // Update navigation buttons
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;
}

function createObjectiveQuestion(question, container) {
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "space-y-2 mt-4";
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "flex items-center space-x-2";
        
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question-option";
        radio.value = index;
        radio.className = "form-radio text-blue-600";
        
        const label = document.createElement("label");
        label.textContent = option;
        label.className = "text-gray-300";
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
    
    const submitBtn = createSubmitButton();
    
    container.appendChild(optionsContainer);
    container.appendChild(submitBtn);
}

function createNumericalQuestion(question, container) {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "w-full px-4 py-2 mt-4 bg-gray-700 border border-gray-600 rounded-md text-white";
    input.placeholder = "Enter your answer";
    
    const submitBtn = createSubmitButton();
    
    container.appendChild(input);
    container.appendChild(submitBtn);
}

function createSubjectiveQuestion(container) {
    // For subjective questions, we only need the show solution button
    // which is already present in the HTML
    showSolutionBtn.textContent = "Show Solution";
}

function createSubmitButton() {
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";
    submitBtn.className = "mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md focus:outline-none";
    
    submitBtn.addEventListener("click", checkAnswer);
    return submitBtn;
}

function checkAnswer() {
    const question = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    let userAnswer;

    if (question.question_type === "objective") {
        const selectedOption = document.querySelector('input[name="question-option"]:checked');
        if (selectedOption) {
            userAnswer = parseInt(selectedOption.value);
            isCorrect = userAnswer === question.correct_answer;
        }
    } else if (question.question_type === "numerical") {
        const numericInput = document.querySelector('#answer-container input[type="number"]');
        if (numericInput) {
            userAnswer = numericInput.value;
            isCorrect = userAnswer === question.correct_answer;
        }
    }

    // Show result and solution
    solutionText.classList.remove("hidden");
    solutionText.innerHTML = `
        <div class="mb-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}">
            ${isCorrect ? 'Correct!' : 'Incorrect!'} 
        </div>
        <div class="text-gray-300">
            ${question.solution}
        </div>
    `;
    typesetMathJax();
}

function toggleSolution() {
    const question = currentQuestions[currentQuestionIndex];
    
    if (question.question_type === "subjective" || !question.question_type) {
        solutionText.classList.toggle("hidden");
        if (!solutionText.classList.contains("hidden")) {
            solutionText.textContent = question.solution;
            showSolutionBtn.textContent = "Hide Solution";
        } else {
            solutionText.textContent = '';
            showSolutionBtn.textContent = "Show Solution";
        }
    }
    typesetMathJax();
}

prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
    typesetMathJax();
});

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
    typesetMathJax();
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add event listener for show solution button
showSolutionBtn.addEventListener("click", toggleSolution);
