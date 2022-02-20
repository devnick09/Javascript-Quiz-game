const InfoBox = document.querySelector(".info_box");
const StartBtn = document.querySelector(".btn_start");
const QuizBox = document.querySelector(".quiz_box");
const optionList = document.querySelector(".option_list");
const timeCounter = document.querySelector(".timeSec");
const quesCheck = document.querySelector(".ques_check");
const scoreBox = document.querySelector(".score_box");
const score = scoreBox.querySelector(".score");
const viewScore = document.querySelector(".view_score");
const submitBtn = document.querySelector(".form");
const Name = document.querySelector(".name");
const User = document.querySelector(".user");
const LeaderBoard = document.querySelector(".leaderboard");

viewScore.style.display = "none";
scoreBox.style.display = "none";
QuizBox.style.display = "none";
InfoBox.style.display = "block";

//LeaderBoard Button Action
LeaderBoard.addEventListener("click", showLeaderBoard);
function showLeaderBoard() {
  viewScore.style.display = "block";
  InfoBox.style.display = "none";
  getNames();
  LeaderBoard.style.pointerEvents = "none";
}

//Start Button action
let questionNum = 0;
StartBtn.addEventListener("click", addQuizBox);
function addQuizBox() {
  InfoBox.style.display = "none";
  QuizBox.style.display = "block";
  showQuestion(questionNum);
  startTimer(50);
  nextBtn.style.display = "none";
  LeaderBoard.style.pointerEvents = "none";
}

let counter;

//For set Timer to Quiz question 50s
function startTimer(t) {
  counter = setInterval(timer, 1000);
  function timer() {
    if (t > 0) {
      if (t < 10) {
        timeCounter.textContent = "0" + t;
      } else {
        timeCounter.textContent = t;
      }
      t--;
    } else {
      timeCounter.textContent = "00";
      scoreBox.style.display = "block";
      QuizBox.style.display = "none";
      clearInterval(counter);
    }
  }
}

//This function is for showing question and options
function showQuestion(index) {
  const quesText = document.querySelector(".question");

  let quesTag = "<h2>" + questions[index].questionText + "</h2>";
  let optionTag =
    '<div class="option"><p class="">' +
    questions[index].options[0] +
    "</p></div>" +
    '<div class="option"><p>' +
    questions[index].options[1] +
    "</p></div>" +
    '<div class="option"><p>' +
    questions[index].options[2] +
    "</p></div>" +
    '<div class="option"><p>' +
    questions[index].options[3] +
    "</p></div>";

  quesText.innerHTML = quesTag;
  optionList.innerHTML = optionTag;

  const option = optionList.querySelectorAll(".option");
  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

const nextBtn = document.querySelector(".next_btn");

//This function is for performing click event on any option
function optionSelected(answer) {
  let userAns = answer.textContent;
  let correctAns = questions[questionNum].answer;
  let allOption = optionList.children.length;
  quesCheck.style.display = "block";
  nextBtn.style.display = "block";

  if (userAns == correctAns) {
    quesCheck.innerHTML = `<p>Correct</p>`;
  } else {
    quesCheck.innerHTML = `<p>Incorrect</p>`;
    clearInterval(counter);
    timeCounter.textContent = timeCounter.textContent - 10;
    startTimer(timeCounter.textContent);

    for (let i = 0; i < allOption; i++) {
      if (optionList.children[i].textContent !== correctAns) {
        optionList.children[i].classList.add("decoration");
      }
    }
  }

  for (let i = 0; i < allOption; i++) {
    optionList.children[i].onclick = null;
  }
}

//Next Button Action
nextBtn.addEventListener("click", next);
//this function is for jumping on next question
function next() {
  if (questionNum < questions.length - 1) {
    questionNum++;
    showQuestion(questionNum);
    quesCheck.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    scoreBox.style.display = "block";
    QuizBox.style.display = "none";
    score.innerHTML =
      "<p>Your Final Score is " + timeCounter.textContent + "</p>";
    clearInterval(counter);
  }
}

//Submit button action
submitBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  scoreBox.style.display = "none";
  saveLocalName(Name.value, timeCounter.textContent);
  getNames();
});

//saving Initials in Local Storage
function saveLocalName(name, score) {
  let players;
  if (localStorage.getItem("players") === null) {
    players = [];
  } else {
    players = JSON.parse(localStorage.getItem("players"));
  }
  score = Number(score);
  players.push({ name, score });
  localStorage.setItem("players", JSON.stringify(players, null));
}

//Getting name from local storage
function getNames() {
  let players;
  if (localStorage.getItem("players") === null) {
    players = [];
  } else {
    players = JSON.parse(localStorage.getItem("players"));
  }
  viewScore.style.display = "block";

  //Outer pass
  for (let i = 0; i < players.length; i++) {
    //Inner pass
    for (let j = 0; j < players.length - 1; j++) {
      //Value comparison using ascending order
      if (players[j + 1].score > players[j].score) {
        //Swapping
        [players[j + 1], players[j]] = [players[j], players[j + 1]];
      }
    }
  }

  players.forEach((player) => {
    const name = player.name;
    const score = player.score;
    User.innerHTML += "<li>" + name + "-" + score + "</li>";
  });
}

//Reset Button Action
document.querySelector(".back").addEventListener("click", () => {
  location.reload();
});

//Clear Highscores Action
document.querySelector(".clear").addEventListener("click", () => {
  localStorage.clear();
  User.innerHTML = "";
});
