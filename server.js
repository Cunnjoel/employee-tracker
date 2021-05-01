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
    }); return start();
};

const viewEmployeeDepartment = () => {
    console.log('Selecting employee by department...\n');
    connection.query('SELECT id From department', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    }); return start();
};

const viewEmployeeManager = () => {
    console.log('Select employee by manager...\n');
    connection.query('SELECT manager_id From employee', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    }); return start();
};

// function to handle posting new employee info
const addEmployee = () => {
    // prompt for info about the employee being added
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name of the employee?',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name of the employee?',
            },
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the employee?',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the employee?',
            },
            {
                name: 'name',
                type: 'input',
                message: 'What department will the employee be working?',
            },
            {
                name: 'manager',
                type: 'input',
                message: 'Who is the manager of the employee?',
            },

        ])
        .then((answer) => {
            // when finished prompting, insert a new employee into the db with that info
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    title: answer.title,
                    salary: answer.salary,
                    name: answer.name,
                    manager_id: answer.manager
                },
                (err) => {
                    if (err) throw err;
                    console.log('Employee was added successfully!');
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
};

const removeEmployee = () => {
    console.log('Remove employee by employee_id...\n');
    connection.query('SELECT From employee', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    }); return start();
}

const updateRole = () => {
    console.log('Update employee role.../n')
    connection.query('SELECT FROM', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    }); return start();
}

const updateManager = () => {
    console.log('Update employee manager.../n')
    connection.query('SELECT FROM', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    }); return start();
}