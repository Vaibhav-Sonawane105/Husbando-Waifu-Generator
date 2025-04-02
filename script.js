// When "Start" is clicked, hide intro and show gender selection
document.getElementById("str-button").addEventListener("click", function () {
    document.getElementById("intro-page").style.display = "none";
    let genderSection = document.getElementById("Select-Gender");
    genderSection.style.display = "flex"; // Ensure it appears
    genderSection.style.justifyContent = "center";
    genderSection.style.alignItems = "center";
});

let currentQuestionIndex = 0;
let selectedAnswers = [];
let chosenQuestions = [];
let chosenCharacters = [];
// Function to start the quiz after selecting gender
function startQuiz(gender) {
    console.log(`Starting quiz for gender: ${gender}`);

    document.getElementById("Select-Gender").style.display = "none"; // Hide gender selection
    document.querySelector(".quiz-container").style.display = "flex"; // Show quiz

    // Fetch questions
    fetch("question.json")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched questions data:", data); // Debugging log
            let questions = data[gender];

            if (!questions || questions.length === 0) {
                console.error(`No questions found for gender: ${gender}`);
                return;
            }

            chosenQuestions = questions; // Assign to global variable
            console.log("Chosen questions:", chosenQuestions);

            // Fetch characters
            fetch("character.json") // Ensure the correct file name
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched character data:", data);

                    // ✅ Select the opposite gender characters
                    let oppositeGender = gender === "male" ? "female" : "male";
                    let characters = data[oppositeGender];

                    if (!characters || characters.length === 0) {
                        console.error(`No characters found for gender: ${oppositeGender}`);
                        return;
                    }

                    chosenCharacters = characters; // Assign opposite-gender characters
                    console.log("Chosen characters:", chosenCharacters);

                    currentQuestionIndex = 0; // Reset question index
                    selectedAnswers = []; // Reset selected answers
                    showQuestion(); // Show first question
                });

            //  .catch(error => console.error("Error loading character.json:", error));
        })
        .catch(error => console.error("Error loading questions.json:", error));
}


// Click event for Male Button
document.getElementById("male-but").addEventListener("click", function () {
    startQuiz("male");  // Pass gender "male"
});

// Click event for Female Button
document.getElementById("female-but").addEventListener("click", function () {
    startQuiz("female");  // Pass gender "female"
});


// Function to display the current question
function showQuestion() {
    if (currentQuestionIndex < chosenQuestions.length) {
        const questionData = chosenQuestions[currentQuestionIndex];
        document.getElementById("question-container").innerHTML = `
            <p>${questionData.question}</p>
        `;

        let optionsHtml = "";
        for (const [optionText, trait] of Object.entries(questionData.options)) {
            optionsHtml += `<button class="option-btn" onclick="selectAnswer('${trait}')">${optionText}</button>`;
        }

        document.getElementById("options-container").innerHTML = optionsHtml;
    } else {
        showResult(); // Show result once all questions are answered
    }
}



// Function to handle answer selection
function selectAnswer(answer) {
    selectedAnswers.push(answer);  // Store the selected answer
    currentQuestionIndex++;  // Move to the next question
    showQuestion();  // Display the next question
}

let selectedTraits = [];

function selectAnswer(trait) {
    selectedTraits.push(trait);
    currentQuestionIndex++;

    if (currentQuestionIndex < chosenQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}
function findBestMatch(characters, userTraits) {
    let bestMatch = null;
    let highestMatchCount = 0;

    characters.forEach(character => {
        let matchCount = character.traits.filter(trait => userTraits.includes(trait)).length;

        if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            bestMatch = character;
        }
    });

    return bestMatch;
}


// Function to display the final result
function showResult() {
    document.querySelector(".quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "flex";

    let bestMatch = findBestMatch(chosenCharacters, selectedTraits);

    if (bestMatch) {
        document.getElementById("result-text").innerText = `Your match is ${bestMatch.name}! from ${bestMatch.anime}`;
        document.getElementById("result-image").src = bestMatch.image;
    } else {
        document.getElementById("result-text").innerText = "No match found. Try again!";
        document.getElementById("result-image").src = "";
    }
}


