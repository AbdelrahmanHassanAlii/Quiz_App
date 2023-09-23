//for number of questions
const numberOfQuestions = 10;

//create 

//select elements
//get the span to set counter as number of questions
let countSpan = document.querySelector(".quiz-info .count span");

//get the bullets container to set as number of questions
let bulletsContainer = document.querySelector(".bullets .spans");

//get the quiz area for add question and answer
let quizArea = document.querySelector(".quiz-area");


// function to start the req
let getQuestions = () => {
    // Create the request
    let myReq = new XMLHttpRequest();

    // Path of the data
    myReq.open("GET", "./JsonFiles/html.json", true);
    myReq.send();

    // Access data if the connection is done
    myReq.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let jsonData = JSON.parse(myReq.responseText);
            
            // Check if the JSON data contains an array of questions
            if (Array.isArray(jsonData.questions)) {
                let questionArray = jsonData.questions;

                // Get a random sample of 10 questions
                let randomQuestions = getRandomQuestions(questionArray, numberOfQuestions);

                //print data in console for check in dev mood
                console.log(randomQuestions);
                //get the lengh
                let qCount = randomQuestions.length;
                //set the count
                setCounter(qCount)
                //create the bullets
                createBullets(qCount);
                //add question data from api
                addQuestion(randomQuestions[0], qCount);
            } else {
                console.error("JSON data does not contain an array of questions.");
            }
        }
    };
};

// Function to get a random sample of questions
function getRandomQuestions(questions, count) {
    let shuffledQuestions = questions.slice(); // Create a copy to avoid modifying the original array
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    return shuffledQuestions.slice(0, count); // Return the first 'count' questions
}

// Call the getQuestions function to fetch and display random questions
getQuestions();

//function set counter of question ( will use in get question fun in req done )
let setCounter = (num) => {
    countSpan.innerHTML = num;
}

// function for create the bullets
let createBullets = (num) => {
    for ( i=0; i<num ; i++ ){
        //create the bullet
        let bullet = document.createElement("span");
        //let frist bullet active as default
        if(i === 0){
            bullet.className = 'on'; 
        }
        //append it to the container
        bulletsContainer.appendChild(bullet)
    }

};


let addQuestion = (data, count) => {
    //create the h2 for (question)
    let question = document.createElement("h2");
    //create question text
    question.textContent = data.question;
    //add the question to its area
    quizArea.appendChild(question);
    //print data in console for check in dev mood
    console.log(data.question);   
};


