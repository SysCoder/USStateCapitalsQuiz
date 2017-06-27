'use strict';
require('dotenv').config();

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const dashbot = require('dashbot')("YTZGEAcsgj5EC3D8RF0j8fcFpz7BDZz8JSVBmXqz").google;

var STATE_IN_QUESTION_CONTEXT = "state_in_question_context";
var USER_SCORE = "user_score";

var STATE_TO_CAPITAL = {
    "Alabama": "Montgomery",
    "Alaska": "Juneau",
    "Arizona":	"Phoenix",
    "Arkansas":	"Little Rock",
    "California": "Sacramento",
    "Colorado": "Denver",
    "Connecticut": "Hartford",
    "Delaware": "Dover",
    "Florida": "Tallahassee",
    "Georgia": "Atlanta",
    "Hawaii": "Honolulu",
    "Idaho": "Boise",
    "Illinois": "Springfield",
    "Indiana": "Indianapolis",
    "Iowa": "Des Moines",
    "Kansas": "Topeka",
    "Kentucky": "Frankfort",
    "Louisiana": "Baton Rouge",
    "Maine": "Augusta",
    "Maryland":	"Annapolis",
    "Massachusetts": "Boston",
    "Michigan": "Lansing",
    "Minnesota": "St. Paul",
    "Mississippi": "Jackson",
    "Missouri": "Jefferson City",
    "Montana":	"Helena",
    "Nebraska": "Lincoln",
    "Nevada": "Carson City",
    "New Hampshire": "Concord",
    "New Jersey": "Trenton",
    "New Mexico": "Santa Fe",
    "New York":  "Albany",
    "North Carolina": "Raleigh",
    "North Dakota":	"Bismarck",
    "Ohio":  "Columbus",
    "Oklahoma":  "Oklahoma City",
    "Oregon": "Salem",
    "Pennsylvania":  "Harrisburg",
    "Rhode Island": "Providence",
    "South Carolina": "Columbia",
    "South Dakota": "Pierre",
    "Tennessee": "Nashville",
    "Texas": "Austin",
    "Utah":	"Salt Lake City",
    "Vermont": "Montpelier",
    "Virginia":  "Richmond",
    "Washington": "Olympia",
    "West Virginia": "Charleston",
    "Wisconsin": "Madison",
    "Wyoming": "Cheyenne",
};

// [START YourAction]
exports.usStateCapitalQuiz = (request, response) => {
  const app = new App({request, response});
  dashbot.configHandler(app);
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Questions
  let welcomeMessage = "Hello, welcome to Capital Quiz. I will give a state, you give the state capital. ";
  let question = "What is the capital of "

  function welcomeWithQuestion (app) {
    var states = Object.keys(STATE_TO_CAPITAL);
    var stateInQuestion = states[Math.floor(Math.random() * states.length)];

    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
    app.setContext(USER_SCORE, 100, {"score": createUserState()});
    app.ask(welcomeMessage + question + stateInQuestion + "?");
  }

  function restartWithQuestion (app) {
    var states = Object.keys(STATE_TO_CAPITAL);
    var stateInQuestion = states[Math.floor(Math.random() * states.length)];

    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
    app.setContext(USER_SCORE, 100, {"score": createUserState()});
    app.ask("Okay, new game! " + question + stateInQuestion + "?");
  }

  function questionAnswered (app) {
    var stateAsked = app.getContextArgument(STATE_IN_QUESTION_CONTEXT, "stateAsked");
    let score = app.getContextArgument(USER_SCORE, "score").value;
    var states = Object.keys(STATE_TO_CAPITAL);
    var capitalGuessed = app.getArgument("Capital");

    var stateInQuestion = getRandomStateThatUserHasNotGottenCorrect(score);
    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
    if (capitalGuessed === STATE_TO_CAPITAL[stateAsked.value]) {
      score[stateAsked.value].correct += 1;
      stateInQuestion = getRandomStateThatUserHasNotGottenCorrect(score);
      app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
      if (countNumberOfCorrectlyAnswered(score) == Object.keys(STATE_TO_CAPITAL).length) {
        let finishedGameStatsResponse = "";

        finishedGameStatsResponse = "You responded incorrectly " + countNumberOfNotCorrectlyAnswered(score) + " times. ";


        app.setContext(USER_SCORE, 100, {"score": createUserState()});
        app.ask("Correct! You finished all questions correctly! " + finishedGameStatsResponse + question + stateInQuestion + "?");
      } else {
        app.setContext(USER_SCORE, 100, {"score": score});
        app.ask("Correct! " + question + stateInQuestion + "?");
      }

    } else {
      score[stateAsked.value].incorrect += 1;
      app.setContext(USER_SCORE, 100, {"score": score});
      app.ask("That is incorrect! The capital is: " + STATE_TO_CAPITAL[stateAsked.value] + ". " + question + stateInQuestion + "?");
    }

  }

  function askedForAnswer(app) {
    var stateAsked = app.getContextArgument(STATE_IN_QUESTION_CONTEXT, "stateAsked");
    let score = app.getContextArgument(USER_SCORE, "score").value;
    var states = Object.keys(STATE_TO_CAPITAL);

    var stateInQuestion = getRandomStateThatUserHasNotGottenCorrect(score);
    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});

    score[stateAsked.value].incorrect += 1;
    app.setContext(USER_SCORE, 100, {"score": score});
    app.ask("The capital is: " + STATE_TO_CAPITAL[stateAsked.value] + ". " + question + stateInQuestion + "?");
  }

  function currentScore(app) {
    let score = app.getContextArgument(USER_SCORE, "score").value;
    app.setContext(USER_SCORE, 100, {"score": score});
    app.ask("You have answered " + countNumberOfCorrectlyAnswered(score) + " correctly. You have " + countNumberOfNotCorrectlyAnswered(score) + " to go." );
  }

  function repeat(app) {
    var stateAsked = app.getContextArgument(STATE_IN_QUESTION_CONTEXT, "stateAsked").value;
    let score = app.getContextArgument(USER_SCORE, "score").value;

    var stateInQuestion = stateAsked;
    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
    app.setContext(USER_SCORE, 100, {"score": score});
    app.ask(question + stateInQuestion + "?");
  }

  const actionMap = new Map();
  actionMap.set('input.welcome', welcomeWithQuestion);
  actionMap.set('question_answered', questionAnswered);
  actionMap.set('give_answer', askedForAnswer);
  actionMap.set('score', currentScore);
  actionMap.set('RESTART_GAME', restartWithQuestion);
  actionMap.set('input.repeat', repeat);

  app.handleRequest(actionMap);
};

function countNumberOfNotCorrectlyAnswered(userState) {
   return Object.keys(userState).length - countNumberOfCorrectlyAnswered(userState);
}

function countNumberOfCorrectlyAnswered(userState) {
    return Object.keys(userState).filter(function(key) {return userState[key].correct !== 0}).length;
}

function countNumberOfIncorrectlyAnswered(userState) {
    return Object.keys(userState).filter(function(key) {return userState[key].incorrect !== 0}).length;
}


function getRandomStateThatUserHasNotGottenCorrect(userState) {
    var availableStates = Object.keys(userState).filter(function(key) {return userState[key].correct === 0});
    return availableStates[Math.floor(Math.random() * availableStates.length)];
}

function createUserState() {
    var reVal = {};
    var states = Object.keys(STATE_TO_CAPITAL);
    for(var i = 0;i < states.length;i++) {
        reVal[states[i]] = {
            correct: 0,
            incorrect: 0,
        };

    }
    return reVal;
}
// [END YourAction]
