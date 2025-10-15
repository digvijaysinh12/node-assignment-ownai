"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginController = exports.registerController = void 0;

var _db = require("../db.js");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _User = require("../entities/User.js");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var registerController = function registerController(req, res) {
  var _req$body, name, email, password, role, phone, city, country, userData, existUser, hashedPass, newUser;

  return regeneratorRuntime.async(function registerController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, role = _req$body.role, phone = _req$body.phone, city = _req$body.city, country = _req$body.country; // Validations

          if (!name || !email || !password || !phone) {
            res.status(400).json({
              success: false,
              message: "Missing required fields : name, email, password, role, phone are mandatory"
            });
          }
          /*
              AppDataSource is used to interact with database and
              .getRepository is class of TypeORM that gives method for interact
              with database table corresponsd entity like in this code User
              method like findOne(),find(),create(),save()
          */


          userData = _db.AppDataSource.getRepository(_User.User); // Check existing of entry no duplicate email allow

          _context.next = 6;
          return regeneratorRuntime.awrap(userData.findOne({
            where: {
              email: email
            }
          }));

        case 6:
          existUser = _context.sent;

          if (!existUser) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(409).json({
            success: false,
            message: "Email already registered"
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 11:
          hashedPass = _context.sent;
          newUser = userData.create({
            name: name,
            email: email,
            password: hashedPass,
            role: role,
            phone: phone,
            city: city,
            country: country
          }); // save user

          _context.next = 15;
          return regeneratorRuntime.awrap(userData.save(newUser));

        case 15:
          return _context.abrupt("return", res.status(201).json({
            success: true,
            message: "User registered successfully"
          }));

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Error in register", _context.t0.message);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error"
          }));

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // This is login Controller


exports.registerController = registerController;

var loginController = function loginController(req, res) {
  var _req$body2, email, password, userData, foundUser, isMatch, JWT_SECRET, token;

  return regeneratorRuntime.async(function loginController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // Validations

          if (!(!email, !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(409).json({
            success: false,
            message: 'Missing required fields : email, password'
          }));

        case 4:
          userData = _db.AppDataSource.getRepository(_User.User); // Check user exitency

          _context2.next = 7;
          return regeneratorRuntime.awrap(userData.findOne({
            where: {
              email: email
            }
          }));

        case 7:
          foundUser = _context2.sent;

          if (foundUser) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, foundUser.password));

        case 12:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            success: false,
            message: 'Invalid Credentials'
          }));

        case 15:
          // Now we will generate token for authorization purpose
          JWT_SECRET = process.env.JWT_SECRET;
          token = _jsonwebtoken["default"].sign({
            id: foundUser.id,
            role: foundUser.role,
            email: foundUser.email
          }, JWT_SECRET, {
            expiresIn: "1h"
          }); // Store token in cookie httpOnly: true makes it safe from JS access

          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
          });
          res.status(201).json({
            success: true,
            message: 'User login Successfully'
          });
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error('Error in login', _context2.t0.message);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error"
          }));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.loginController = loginController;