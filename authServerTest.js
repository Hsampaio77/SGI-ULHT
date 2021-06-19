const net = require('net');
const chalk = require("chalk");
var ng = require("nonce-generator");
var nt = require("nonce")();
const ECKey = require("ec-key");
const fs = require("fs");
const repository = require("./users/users.json");


function nonceGen(size) {
    return ng(size-15).concat(nt());
    }

var reply = {
    "user": String,
    "action": String,
    "data": String
  };

const server = net.createServer((socket) => {
    // 'connection' listener
    console.log('Client connected');
    reply.action = 'user';
    reply.user = null;
    reply.data = 'Client connected\r\n';
    socket.write(JSON.stringify(reply));
    console.log(reply)
    var user_current = null


    // Error conditions
    socket.on('end', (err) => {
        console.log('Client disconnected', err);
    });

    socket.on('error', (err) => {
        console.log('Socket error ', err);
    });

    socket.on('data', (data) => {
            reply = JSON.parse(data);
            console.log(chalk.bold("Received data from client:"))
            console.log(reply)

        switch(reply.action){
            case 'user':
                user_current = repository.users.find((user) => {                    
                    return user.user == reply.user;
                });
                if (user_current) {
                    nonce = nonceGen(64);
                    reply.user = user_current.user;
                    reply.action = 'challenge';
                    reply.data = nonce;
                } else {
                    reply.user = '';
                    reply.action = 'error'
                    reply.data = 'User does not exist';
                }
                break;
            case 'response':
                if (user_current){
                    let pem = fs.readFileSync("users/"+user_current.user+"-pub.pem");
                    let key = new ECKey(pem, "pem");
                    let eccPublikey = key.asPublicECKey();
                    if (verifyfunction(eccPublikey,nonce, reply.data)){ 
                        reply.user = '';
                        reply.action = 'user';
                        reply.data = 'User Authenticated';
                        console.log(chalk.bold.green.inverse("User Authenticated"))
                    }else{
                        reply.user = '';
                        reply.action = 'user';
                        reply.data = 'Hash does not match'
                        console.log(chalk.bold.green.inverse("User NOT Authenticated"))
                    }
                    user_current = null;
                }
                break;       

        }
        
              socket.write(JSON.stringify(reply));
    });
});

function verifyfunction(eccPubliKey,message, signature){
    return eccPubliKey.createVerify('SHA256')
   .update(message)
   .verify(signature, 'base64');
}
server.listen(8080, () => {
    console.log('server listening on', server.address());
});

 server.on('error', (err) => {
    console.log(err);
  });

  

  