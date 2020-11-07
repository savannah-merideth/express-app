
// const jwt = require('../services').JwtService;
const { JwtService } = require('../services');

require('dotenv').config({ path: './dev.env' });


var payload = 'secret';
//var payload = {f:'secret'};

var token = JwtService.sign(payload);
console.log("Token :" + token);

/*
 ====================   JST Verify =====================
*/


var legit = JwtService.verify(token);
console.log("\nJWT verification result: " + JSON.stringify(legit));

/*
 ====================   JST Decode =====================
*/
var decoded = JwtService.decode(token);
console.log("\nDecoded jwt: " + JSON.stringify(decoded));


var is_logout = JwtService.logout(token);
console.log("\nis_logout: ", is_logout);
is_logout = JwtService.logout(token);
console.log("\nis_logout: ", is_logout);