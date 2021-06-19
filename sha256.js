const readline = require('readline');
const crypto = require('crypto');

// Reads input and generates a sha256 hash
// and a random time stamped nonceGen

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var prompt = 'Input: ';
rl.setPrompt(prompt, prompt.length);
rl.prompt();
rl.on('line', (input) => {
  var hash = crypto.createHash('sha256').update(input).digest("hex");
  console.log("Hash: " + hash);
  rl.prompt();
});
