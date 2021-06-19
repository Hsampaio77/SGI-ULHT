const readline = require('readline');
var repository = require("users/users.json");

const rs = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
 });
 const prompt = 'User: ';
 rs.setPrompt(prompt, prompt.length);
 rs.prompt();

rs.on('line', (input) => {
  var current_user = removeBackspaces(input);
  var user_exists = false;
  var passwd;
  for (var i in repository.users) {
    // console.log(usr)
    if (repository.users[i].user == current_user) {
      user_exists = true;
      passwd = repository.users[i].passwd;
      break;
    }
  }
  if (user_exists == true)
      console.log('User ' + current_user + ' exists with passwd ' + passwd);
    else {
      console.log('User ' + current_user + ' does not exist');
    }
    rs.prompt();
});

function removeBackspaces(str){
  var result = "";
  for(var i in str){
    if(str.charCodeAt(i) == 8)
    {
      result = result.slice(0, -1);
    }else{
      result += str.charAt(i);
    }
  }
  return result;
}
