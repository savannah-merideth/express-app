const { JwtService } = require('../services');

class JwtMiddleware {

  constructor() { }

  verify(req, res, next) {
    const bearer = req.header('Authorization') || '';
    var token = bearer.split(' ')[1];
    if (!token)
      token = req.cookies.auth_token;
    const valid = JwtService.verify(token);
    var err = null;
    if (valid)
      req.user = JwtService.get_payload(token);
    else
      err = new Error('You must be logged in to view this page.');
    return next(err);
  }

  hasRole(role) {
    return (req, res, next) => {
      const bearer = req.header('Authorization') || '';
      const token = bearer.split(' ')[1];
      const decoded = JwtService.decode(token);
      const foundRole = decoded.payload.roles.find(e => e.role === role);
      var err = foundRole ? null : new Error('Access Denied');
      return next(err);
    }
  }

  hasAllRoles(roles) {
    return (req, res, next) => {
      const bearer = req.header('Authorization') || '';
      const token = bearer.split(' ')[1];
      const decoded = JwtService.decode(token);
      const foundAllRole = roles.every(e => decoded.payload.roles.find(i => i.role === e));
      var err = foundAllRoles ? null : new Error('Access Denied');
      return next(err);
    }
  }

  hasAnyRole(roles) {
    return (req, res, next) => {
      const bearer = req.header('Authorization') || '';
      const token = bearer.split(' ')[1];
      const decoded = JwtService.decode(token);
      const foundAnyRole = roles.some(e => decoded.payload.roles.find(i => i.role === e));
      var err = foundAnyRole ? null : new Error('Access Denied');
      return next(err);
    }
  }

}

module.exports = new JwtMiddleware();