'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const jwtConfig = require('../config/jwt');
var path = require('path');
var folder = path.join(__dirname, '../config');

const privateKey = fs.readFileSync(path.join(folder, 'private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(folder, 'public.key'), 'utf8');

class JwtService {

  constructor() {
    this.caches = [];
  }

  sign(payload) {
    if (typeof payload === 'string')
      payload = { payload };
    var index = -1;
    if (this.caches.length > 0)
      index = this.caches.indexOf(JSON.stringify(payload));
    if (index === -1)
      this.caches.push(JSON.stringify(payload));
    return jwt.sign(payload, privateKey, jwtConfig.options);
  }

  find_index(object) {
    if (object) {
      if (!this.caches)
        this.caches = [];
      if (this.caches.length > 0)
        return this.caches.indexOf(JSON.stringify(object));
    }

    return -1;
  }

  verify(token) {
    if (!token)
      return null;
    try {
      // get the decoded payload and header
      var object = this.get_payload(token);
      // console.log('verify', object, this.find_index(object));
      var index = this.find_index(object);
      if (index === -1 && this.caches.length === 0) {
        this.caches.push(JSON.stringify(object));
        index = 0;
      }
      if (index !== -1)
        return jwt.verify(token, publicKey, jwtConfig.options);
      else
        return false;
    } catch (error) {
      return false;
    }
  }

  get_payload(token) {
    if (!token)
      return null;
    var object = jwt.decode(token, { complete: false });
    if (object) {
      delete object.iat;
      delete object.exp;
      delete object.aud;
      delete object.iss;
    }
    return object;
  }

  decode(token) {
    return jwt.decode(token, { complete: true });
  }

  logout(token) {
    if (!token)
      return false;
    var object = this.get_payload(token);
    var index = this.find_index(object);
    if (index !== -1) {
      this.caches.splice(index, 1);
      return true;
    }

    return false;
  }
}

module.exports = new JwtService();