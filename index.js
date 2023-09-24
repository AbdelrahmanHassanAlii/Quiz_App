//for number of questions
const numberOfQuestions = 10;
const numberOfAnswers = 4;
const duration = 120;

let currentIndex = 0;
let score = 0;

//create

//select elements
//get the span to set counter as number of questions
let countSpan = document.querySelector(".quiz-info .count span");

//get the bullets container to set as number of questions
let bullets = document.querySelector(".bullets");

//get the bullets container to set as number of questions
let bulletsContainer = document.querySelector(".bullets .spans");

//get the quiz area for add question and answer
let quizArea = document.querySelector(".quiz-area");

//get the quiz area for add question and answer
let answersArea = document.querySelector(".answers-area");

//get the submit button
let submitButton = document.querySelector(".submit-button");

//get the result container
let resultContainer = document.querySelector(".results");

//get the count down container
let countdownElement = document.querySelector(".count-down");

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
        let randomQuestions = getRandomQuestions(
          questionArray,
          numberOfQuestions
        );

        //print data in console for check in dev mood
        console.log(randomQuestions);
        //get the lengh
        let qCount = randomQuestions.length;
        //set the count
        setCounter(currentIndex + 1);
        //create the bullets
        createBullets(qCount);
        //add question data from api
        addQuestion(randomQuestions[currentIndex], qCount);
        //add answers data from api
        addAnswers(randomQuestions[currentIndex], qCount);

        // count down handle
        countdown(duration, qCount);
        //handle click button
        submitButton.onclick = () => {
          //get the correct answer
          let rightAnswer = randomQuestions[currentIndex].correctAnswer;
          //increase the index
          currentIndex++;
          //set the count
          setCounter(currentIndex + 1);
          //check the answres
          checkedAnswer(rightAnswer, qCount);
          //removev prev question and answer
          quizArea.innerHTML = "";
          answersArea.innerHTML = "";
          //add next question data from api
          addQuestion(randomQuestions[currentIndex], qCount);
          //add next answers data from api
          addAnswers(randomQuestions[currentIndex], qCount);
          //handle bullets on click
          handleBullets();
          // count down handle
          clearInterval(countdownInterval);
          countdown(duration, qCount);
          //show answers
          showResults(qCount);
        };
      }
    } else {
      console.error("JSON data does not contain an array of questions.");
    }
  };
};

// Function to get a random sample of questions
function getRandomQuestions(questions, count) {
  let shuffledQuestions = questions.slice(); // Create a copy to avoid modifying the original array
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [
      shuffledQuestions[j],
      shuffledQuestions[i],
    ];
  }
  return shuffledQuestions.slice(0, count); // Return the first 'count' questions
}

// Call the getQuestions function to fetch and display random questions
getQuestions();

//function set counter of question ( will use in get question fun in req done )
let setCounter = (num) => {
  countSpan.innerHTML = num;
};

// function for create the bullets
let createBullets = (num) => {
  for (i = 0; i < num; i++) {
    //create the bullet
    let bullet = document.createElement("span");
    //let frist bullet active as default
    if (i === 0) {
      bullet.className = "on";
    }
    //append it to the container
    bulletsContainer.appendChild(bullet);
  }
};

let addQuestion = (data, count) => {
  if (currentIndex < count) {
    //create the h2 for (question)
    let question = document.createElement("h2");
    //create question text
    question.textContent = data.question;
    //add the question to its area
    quizArea.appendChild(question);
    //print data in console for check in dev mood
    console.log(data.question);
  }
};

let addAnswers = (data, count) => {
  if (currentIndex < count) {
    //creating 4 answer boxes
    for (let i = 1; i <= numberOfAnswers; i++) {
      //create the div box
      let answer = document.createElement("div");
      //add the class name
      answer.className = "answer";
      //create the radio input element
      let inputRatio = document.createElement("input");
      //add type name id classAttribute to the input element
      inputRatio.name = "answer";
      inputRatio.type = "radio";
      inputRatio.id = `answer_${i}`;
      inputRatio.dataset.answer = `${data.options[i - 1]}`;

      //answer number 1 is checked
      if (i === 1) {
        inputRatio.checked = true;
      }
      //create the label element
      let labelAnswer = document.createElement("label");
      //add for attribute
      labelAnswer.htmlFor = `answer_${i}`;
      //add the label text
      labelAnswer.textContent = `${data.options[i - 1]}`;
      //add label and input to answer div
      answer.appendChild(inputRatio);
      answer.appendChild(labelAnswer);
      //add all to answer area
      answersArea.appendChild(answer);
    }
    //print data in console for check in dev mood
    console.log(data);
    console.log(data.options);
  }
};

let checkedAnswer = (rightAnswer, count) => {
  if (currentIndex === count) {
    let answers = document.getElementsByName("answer");
    let choosenAnswer;
    for (i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        choosenAnswer = answers[i].dataset.answer;
      }
    }
    if (rightAnswer === choosenAnswer) {
      score++;
      console.log("good answer");
    }
    //print data in console for check in dev mood
  }
  //   console.log("rightAnswer", rightAnswer);
  //   console.log(`choosenAnswer`, choosenAnswer);
};

let handleBullets = () => {
  let bullets = document.querySelectorAll(".bullets .spans span");
  let arrayOfBullets = Array.from(bullets);
  arrayOfBullets.forEach((bullet, index) => {
    if (currentIndex === index) {
      bullet.className = "on";
    }
  });
};

function showResults(count) {
  let result;
  if (currentIndex === count) {
    countSpan.remove();
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (score > count / 2 && score < count) {
      result = `<span class="good">Good</span>, ${score} From ${count}`;
    } else if (score === count) {
      result = `<span class="perfect">Perfect</span>, ${score} From ${count}`;
    } else {
      result = `<span class="bad">Bad</span>, ${score} From ${count}`;
    }
    resultContainer.innerHTML = result;
    resultContainer.style.padding = "10px";
    resultContainer.style.backgroundColor = "white";
    resultContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
