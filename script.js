const app = document.getElementById("app");

let quizData = {
    categories: {
        cricket: [
            { question: "Who won the ICC World Cup 2019?", answers: ["India", "England", "Australia", "New Zealand"], correct: "England" },
            { question: "Who is the highest wicket-taker in Test cricket?", answers: ["Shane Warne", "Muttiah Muralitharan", "Anil Kumble", "Glenn McGrath"], correct: "Muttiah Muralitharan" },
        ],
        movie: [
            { question: "Who directed the movie 'Inception'?", answers: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Martin Scorsese"], correct: "Christopher Nolan" },
            { question: "Which movie won Best Picture at the 2022 Oscars?", answers: ["CODA", "Dune", "The Power of the Dog", "West Side Story"], correct: "CODA" },
        ],
        generalknowledge: [
            { question: "What is the capital of India?", answers: ["Mumbai", "Delhi", "Chennai", "Kolkata"], correct: "Delhi" },
            { question: "Which planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Saturn"], correct: "Mars" },
        ],
        technical: [
            { question: "What does HTML stand for?", answers: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"], correct: "Hyper Text Markup Language" },
            { question: "Which language is used for styling web pages?", answers: ["HTML", "JQuery", "CSS", "XML"], correct: "CSS" },
        ],
    },
    currentCategory: null,
    numQuestions: 0,
    timePerQuestion: 0,
    score: 0,
    currentQuestionIndex: 0,
    timer: null,
    randomQuestions: []
};

function startQuiz() {
    app.innerHTML = `
        <h1>Welcome to Quiz App</h1>
        <button onclick="showCategories()">Start Quiz</button>
    `;
}

function showCategories() {
    app.innerHTML = `
        <h2>Select a Category</h2>
        <ul class="options">
            ${Object.keys(quizData.categories)
                .map((category) => `<li onclick="selectCategory('${category}')">${category}</li>`)
                .join("")}
        </ul>
    `;
}

function selectCategory(category) {
    quizData.currentCategory = category;
    app.innerHTML = `
        <h2>How many questions?</h2>
        <ul class="options">
            <li onclick="setNumQuestions(2)">2</li>
            <li onclick="setNumQuestions(10)">10</li>
            <li onclick="setNumQuestions(15)">15</li>
            <li onclick="setNumQuestions(20)">20</li>
        </ul>
    `;
}

function setNumQuestions(num) {
    quizData.numQuestions = num;
    app.innerHTML = `
        <h2>Time per question?</h2>
        <ul class="options">
            <li onclick="setTimePerQuestion(10)">10 seconds</li>
            <li onclick="setTimePerQuestion(20)">20 seconds</li>
            <li onclick="setTimePerQuestion(30)">30 seconds</li>
        </ul>
    `;
}

function setTimePerQuestion(time) {
    quizData.timePerQuestion = time;
    quizData.score = 0;
    quizData.currentQuestionIndex = 0;
    quizData.timer = null;
    quizData.randomQuestions = shuffle(quizData.categories[quizData.currentCategory]).slice(0, quizData.numQuestions);
    displayQuestion();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestion() {
    const question = quizData.randomQuestions[quizData.currentQuestionIndex];
    app.innerHTML = `
        <h2>${question.question}</h2>
        <ul class="options">
            ${question.answers
                .map(
                    (answer) => `<li onclick="checkAnswer(this, '${question.correct}')">${answer}</li>`
                )
                .join("")}
        </ul>
        <footer>Time remaining: <span id="timer">${quizData.timePerQuestion}</span>s</footer>
    `;
    startTimer();
}

function startTimer() {
    let timeRemaining = quizData.timePerQuestion;
    const timerElement = document.getElementById("timer");
    quizData.timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(quizData.timer);
            moveToNextQuestion();
        }
    }, 1000);
}

function checkAnswer(selectedElement, correctAnswer) {
    clearInterval(quizData.timer);

    const options = document.querySelectorAll(".options li");
    options.forEach((li) => {
        li.classList.add(li.textContent === correctAnswer ? "correct" : "wrong");
    });

    if (selectedElement.textContent === correctAnswer) {
        quizData.score++;
    }

    setTimeout(() => {
        moveToNextQuestion();
    }, 2000);
}

function moveToNextQuestion() {
    quizData.currentQuestionIndex++;
    if (quizData.currentQuestionIndex >= quizData.numQuestions) {
        displayResult();
    } else {
        displayQuestion();
    }
}

function displayResult() {
    app.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${quizData.score} / ${quizData.numQuestions}</p>
        <button onclick="startQuiz()">Go to Home</button>
    `;
}

// Initialize quiz
startQuiz();
