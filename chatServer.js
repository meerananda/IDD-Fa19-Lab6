/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Welcome!\n" + "I'm CATbot, your fur-endly neighborhood chatbot."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Lovely to meowt you ' + input; // output response
    waitTime = 5000;
    question = 'What is your favorite book?'; // load next question
  } else if (questionNum == 1) {
    answer = 'How purrfectly wonderful. Mine is The Great Catsby.';
    waitTime = 5000;
    question = 'Where do you live?'; // load next question
  } else if (questionNum == 2) {
    if (input.toLowerCase() == 'new york'){
      answer = 'Omg I am from Mew York too!';
      waitTime = 5000;
      question = 'Are you a cat person or a *shudder* dog person?'
    }
    else if (input.toLowerCase() != 'new york'){
      answer = 'How paw-some, I have never been there.';
      waitTime = 5000;
      question = 'Are you a cat person or a *shudder* dog person? (Type in cat or dog)';
      }
  } else if (questionNum == 3) {
      if (input.toLowerCase() == 'cat'){
        answer = 'Paw-sitively fantastic! Me too!';
        waitTime = 5000;
        question = 'Do you want to see a cute cat video?'
      }
      else if (input.toLowerCase() == 'dog'){
        answer = 'How a-paw-ling. Why dont you try that again?';
        waitTime = 5000;
        question = 'Are you a cat person or a *shudder* dog person? (Type in cat or dog)'
        questionNum--;
      }
      else {
        answer = "I dont understand! Put me out of my mew-sery and type in cat or dog!";
        waitTime = 5000;
        question = "Are you a cat person or a *shudder* dog person? (Type in cat or dog)";
        questionNum--;
      }

    } else if (questionNum == 4) {
      answer = 'Yay here you go! https://www.youtube.com/watch?v=SB-qEYVdvXA';
      waitTime = 10000;
    // load next question
  } else {
    answer = 'I have nothing more to say!'; // output response
    waitTime = 0;
    question = '';
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
