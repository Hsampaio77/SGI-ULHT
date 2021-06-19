var ng = require('nonce-generator');
var nt = require('nonce')();

// Generates a random time-stamped size bytes nonce
function nonceGen(size) {
  return ng(size-25).concat(nt());
}
var nonce = nonceGen(64);
console.log(nonce, nonce.length);
// console.log(ng(49), nt());
