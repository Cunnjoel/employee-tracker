const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'shelby',
    database: 'employeeDB',
});

connection.connect((err) => {
    if (err) throw err;
    start();
  });

// function which prompts the user for what action they should take
const start = () => {
    inquirer
        .prompt({
            name: 'begin',
            type: 'list',
            message: 'Would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],
        })
        .then((answer) => {
            // based on their answer, calls required function
            if (answer.begin === 'View All Employees') {
                viewEmployee();
            } else if (answer.begin === 'View All Employees By Department') {
                viewEmployeeDepartment();
            } else if (answer.begin === 'View All Employees By Manager') {
                viewEmployeeManager();
            } else if (answer.begin === 'Add Employee') {
                addEmployee();
            } else if (answer.begin === 'Remove Employee') {
                removeEmployee();
            } else if (answer.begin === 'Update Employee Role') {
                updateRole();
            } else if (answer.begin === 'Update Employee Manager') {
                updateManager();
            } else {
                connection.end();
            }
        })
};
// function to handle viewing employees
const viewEmployee = () => {
    console.log('Selecting all employee...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
};

const viewEmployeeDepartment = () => {
    console.log('Selecting employee by department_id...\n');
    connection.query('SELECT id From department', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
};