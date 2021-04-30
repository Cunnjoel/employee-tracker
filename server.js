const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3001,

  // Your username
  user: 'root',

  // Your password
  password: 'shelby',
  database: 'employeeDB',
});