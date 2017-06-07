// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;

// [START YourAction]
exports.usStateCapitalQuiz = (request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Questions
  let welcomeMessage = "Hello, welcome to U.S. Capital Quiz. I will give a state, you give the state capital. ";
  let question = "What is the capital of Texas?"

  // Fulfill action business logic
  function responseHandler (app) {
    // Complete your fulfillment logic and send a response
    app.ask('Hello, World!');
  }

  function welcomeWithQuestion (app) {
    app.ask(welcomeMessage + question);
  }

  function questionAnswered (app) {
    app.ask("Question answered!");
  }

  const actionMap = new Map();
  actionMap.set('input.welcome', welcomeWithQuestion);
  actionMap.set('question_answered', questionAnswered);

  app.handleRequest(actionMap);
};
// [END YourAction]
