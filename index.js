'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;

var STATE_IN_QUESTION_CONTEXT = "state_in_question_context";

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
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Questions
  let welcomeMessage = "Hello, welcome to U.S. Capital Quiz. I will give a state, you give the state capital. ";
  let question = "What is the capital of "

  function welcomeWithQuestion (app) {
    var states = Object.keys(STATE_TO_CAPITAL);
    var stateInQuestion = states[Math.floor(Math.random() * states.length)];

    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
    app.ask(welcomeMessage + question + stateInQuestion + "?");
  }

  function questionAnswered (app) {
    var stateAsked = app.getContextArgument(STATE_IN_QUESTION_CONTEXT, "stateAsked");
    var states = Object.keys(STATE_TO_CAPITAL);
    var capitalGuessed = app.getArgument("Capital");

    var stateInQuestion = states[Math.floor(Math.random() * states.length)];
    app.setContext(STATE_IN_QUESTION_CONTEXT, 100, {"stateAsked": stateInQuestion});
    if (capitalGuessed === STATE_TO_CAPITAL[stateAsked.value]) {
      app.ask("Correct! " + question + stateInQuestion + "?");
    } else {
      app.ask("That is incorrect! The capital is: " + STATE_TO_CAPITAL[stateAsked.value] + ". " + question + stateInQuestion + "?");
    }
  }

  const actionMap = new Map();
  actionMap.set('input.welcome', welcomeWithQuestion);
  actionMap.set('question_answered', questionAnswered);

  app.handleRequest(actionMap);
};
// [END YourAction]
