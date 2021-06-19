const ECKey = require("ec-key");
const fs = require("fs");
const net = require('net');
const readline = require('readline');
const chalk = require("chalk");
const { argv } = require("process");

let pem = fs.readFileSync("users/HerculanoSampaio-pk.pem");
let eccPrivateKey = new ECKey(pem, "pem");

var message = {
  "user": String,
  "action": String,
  "data": String
};

const host = 'localhost';
const port = 8080;
const socket = net.createConnection(port, host, () => {
   console.log('Connected to server!');  
});

const rl = readline.createInterface({
  input: process.stdin,
  output: socket,
});

const rs = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let prompt = '';
let current_state = '';
let current_user = '';

// rs.setPrompt(prompt, prompt.length);
// rs.prompt();


rl.on('line', (input) => {
  switch (current_state) {
    case 'user':
      current_user = removeBackspaces(input);
      message.user = current_user;
      message.action = "user";
      message.data = null;
      socket.write(JSON.stringify(message));
    break;
    }
  });

rl.on('close', () => {
   socket.end();
   console.log('goodbye!');
 });

socket.on('data', (data) => {
  var reply = JSON.parse(data);
  console.log('Server replied: ');
  console.log(reply)
  switch (reply.action) {
    case 'user':
      current_state = 'user';
      prompt = 'User: ';
    break;
    case 'success':
      current_state = 'user';
      prompt = 'User: ';
    break;
    case 'error':
      current_state = 'user';
      prompt = 'User: ';
    break;
    case 'challenge':
      current_state = 'challenge';
      prompt =  '';
      nonce = reply.data;
      message.data = signfunction(nonce);
      message.action = 'response';
      socket.write(JSON.stringify(message));
    break;
  }
  function signfunction(string) {
    return eccPrivateKey.createSign("SHA256").update(string).sign("base64");
  }
  
  message = reply
  rs.setPrompt(prompt, prompt.length);
  rs.prompt();
});

socket.on('end', () => {
   console.log('disconnected from server');
 });
 
 socket.on('error', (err) => {
   console.log('Connection reset by server ' + err);
   process.exit()
 });
 
 function removeBackspaces(str) {
  var result = "";
  for (var i in str) {
    if (str.charCodeAt(i) == 8) {
      result = result.slice(0, -1);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
 }