function typesetMathJax() {
MathJax.Hub.Typeset(document.getElementById("questions-section"));
}

let quizData;
let currentChapterIndex = 0;
let currentQuestionIndex = 0;
let currentQuestions = [];
let selectedMode = null; // 'pdf' or 'mock'
let selectedBranch = null;
let selectedFormat = null; // 'pdf' or 'mock'

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
const backToChapters = document.getElementById("back-to-chapters");
const backToHome = document.getElementById("back-to-home");

document.addEventListener('DOMContentLoaded', () => {
    // Year-wise card click handler
    document.getElementById('year-wise-card').addEventListener('click', () => {
        console.log('Year-wise card clicked'); // Debug log
        document.getElementById('selection-section').classList.add('hidden');
        document.getElementById('year-wise-section').classList.remove('hidden');
    });

    // Chapter-wise card click handler
    document.getElementById('chapter-wise-card').addEventListener('click', () => {
        console.log('Chapter-wise card clicked'); // Debug log
        document.getElementById('selection-section').classList.add('hidden');
        document.getElementById('chapter-wise-section').classList.remove('hidden');
    });

    // Back to main menu button handler
    document.getElementById('back-to-main').addEventListener('click', () => {
        document.getElementById('year-wise-section').classList.add('hidden');
        document.getElementById('chapter-wise-section').classList.add('hidden');
        document.getElementById('selection-section').classList.remove('hidden');
    });

    // Home button handler
    document.getElementById('home-btn').addEventListener('click', () => {
        document.getElementById('year-wise-section').classList.add('hidden');
        document.getElementById('chapter-wise-section').classList.add('hidden');
        document.getElementById('chapters-section').classList.add('hidden');
        document.getElementById('questions-section').classList.add('hidden');
        document.getElementById('selection-section').classList.remove('hidden');
    });

    // PDF and Mock Test card click handlers
    document.getElementById('pdf-format-card').addEventListener('click', () => {
        selectedFormat = 'pdf';
        document.getElementById('year-wise-section').classList.add('hidden');
        document.getElementById('branch-selection-section').classList.remove('hidden');
    });

    document.getElementById('mock-test-card').addEventListener('click', () => {
        selectedFormat = 'mock';
        document.getElementById('year-wise-section').classList.add('hidden');
        document.getElementById('branch-selection-section').classList.remove('hidden');
    });

    // Branch selection handlers
    document.querySelectorAll('.branch-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedBranch = card.dataset.branch;
            document.getElementById('branch-selection-section').classList.add('hidden');
            document.getElementById('semester-selection-section').classList.remove('hidden');
        });
    });

    // Semester selection handlers
    document.querySelectorAll('.semester-card').forEach(card => {
        card.addEventListener('click', () => {
            const semester = card.dataset.semester;
            handleSemesterSelection(selectedBranch, semester, selectedFormat);
        });
    });

    // Back button handlers
    document.getElementById('back-to-branch').addEventListener('click', () => {
        document.getElementById('semester-selection-section').classList.add('hidden');
        document.getElementById('branch-selection-section').classList.remove('hidden');
    });
});

document.getElementById('chapter-wise-card').addEventListener('click', () => {
    document.getElementById('selection-section').classList.add('hidden');
    document.getElementById('chapter-wise-section').classList.remove('hidden');
});

document.getElementById('year-wise-card').addEventListener('click', () => {
    document.getElementById('selection-section').classList.add('hidden');
    document.getElementById('year-wise-section').classList.remove('hidden');
    document.getElementById('chapter-wise-section').classList.add('hidden');
});

backToChapters.addEventListener("click", () => {
    questionsSection.classList.add("hidden");
    chaptersSection.classList.remove("hidden");
});

backToHome.addEventListener("click", () => {
    chaptersSection.classList.add("hidden");
    document.getElementById("selection-section").classList.remove("hidden");
});

document.getElementById('back-to-main').addEventListener('click', () => {
    document.getElementById('year-wise-section').classList.add('hidden');
    document.getElementById('selection-section').classList.remove('hidden');
});

homeBtn.addEventListener("click", () => {
    document.getElementById("chapter-wise-section").classList.add("hidden");
    document.getElementById("chapters-section").classList.add("hidden");
    document.getElementById("questions-section").classList.add("hidden");
    document.getElementById("year-wise-section").classList.add("hidden");
    document.getElementById("selection-section").classList.remove("hidden");
});

document.getElementById('pdf-format-card').addEventListener('click', () => {
    selectedMode = 'pdf';
    document.getElementById('year-wise-section').classList.add('hidden');
    document.getElementById('branch-selection-section').classList.remove('hidden');
});

document.getElementById('mock-test-card').addEventListener('click', () => {
    selectedMode = 'mock';
    document.getElementById('year-wise-section').classList.add('hidden');
    document.getElementById('branch-selection-section').classList.remove('hidden');
});

document.getElementById('back-to-year-wise').addEventListener('click', () => {
    document.getElementById('branch-selection-section').classList.add('hidden');
    document.getElementById('year-wise-section').classList.remove('hidden');
});

document.querySelectorAll('.branch-card').forEach(card => {
    card.addEventListener('click', () => {
        const branch = card.dataset.branch;
        if (selectedMode === 'pdf') {
            handlePDFSelection(branch);
        } else if (selectedMode === 'mock') {
            handleMockTestSelection(branch);
        }
    });
});

function handlePDFSelection(branch) {
    console.log(`PDF format selected for ${branch}`);
}

function handleMockTestSelection(branch) {
    console.log(`Mock Test selected for ${branch}`);
}

function handleSemesterSelection(branch, semester, format) {
    console.log(`Selected: ${format} format, ${branch} branch, semester ${semester}`);
}

function populateBranchDropdown() {
    const branches = Object.keys(quizData.branches);
    branchDropdown.innerHTML = `<option value="" disabled selected> --select branch-- </option>` +
        branches.map(branch => `<option value="${branch}">${capitalize(branch)}</option>`).join("");

    branchDropdown.addEventListener("change", populateSemesterDropdown);
}

function populateSemesterDropdown() {
    const branch = branchDropdown.value;
    semesterDropdown.disabled = false;
    semesterDropdown.innerHTML = `<option value="" disabled selected> --select semester-- </option>`;
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

    document.getElementById("selection-section").classList.add("hidden");
    document.getElementById("chapter-wise-section").classList.add("hidden");
    
    chaptersSection.classList.remove("hidden");
    chaptersList.innerHTML = '';

    chapters.forEach(chapter => {
        const li = document.createElement("li");
        li.textContent = chapter;
        li.classList.add("p-2", "cursor-pointer", "hover:bg-gray-700", "rounded", "text-gray-200", "mb-2");
        li.addEventListener("click", () => {
            loadQuestions(branch, semester, chapter);
            chaptersSection.classList.add("hidden");
        });
        chaptersList.appendChild(li);
    });
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

    questionContainer.textContent = question.question_text;
    const oldAnswerContainer = document.getElementById("answer-container");
    if (oldAnswerContainer) oldAnswerContainer.remove();
    
    solutionText.classList.add("hidden");
    solutionText.textContent = '';
    
    questionContainer.parentNode.insertBefore(answerContainer, showSolutionBtn);

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

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;
}

function createObjectiveQuestion(question, container) {
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full";
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "p-4 rounded-lg border border-gray-600 hover:bg-gray-700 cursor-pointer flex items-center";
        
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question-option";
        radio.value = index;
        radio.className = "hidden";
        
        const customRadio = document.createElement("div");
        customRadio.className = "w-4 h-4 rounded-full border-2 border-blue-500 mr-3 flex items-center justify-center";
        
        const innerDot = document.createElement("div");
        innerDot.className = "w-2 h-2 rounded-full bg-blue-500 hidden";
        
        const label = document.createElement("label");
        label.textContent = option;
        label.className = "text-gray-300 flex-grow";
        
        customRadio.appendChild(innerDot);
        optionDiv.appendChild(radio);
        optionDiv.appendChild(customRadio);
        optionDiv.appendChild(label);
        
        optionDiv.addEventListener('click', () => {
            document.querySelectorAll('input[name="question-option"]').forEach(r => {
                r.checked = false;
                r.parentElement.classList.remove('bg-gray-700');
                r.parentElement.querySelector('.w-2.h-2').classList.add('hidden');
            });
            radio.checked = true;
            optionDiv.classList.add('bg-gray-700');
            innerDot.classList.remove('hidden');
        });
        
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

showSolutionBtn.addEventListener("click", toggleSolution);
