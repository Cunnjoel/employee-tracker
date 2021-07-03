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
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Role', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'List of Employees by Department', 'Exit'],
        })
        .then((answer) => {
            // based on their answer, calls required function
            switch (answer.begin) {
                case 'View All Employees':
                    viewEmployee();
                    break;
                case 'View All Employees By Department':
                    viewDepartment();
                    break;
                case 'View All Employees By Role':
                    viewRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'List of Employees by Department':
                    employeeByDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        })
};
// function to handle viewing employees
const viewEmployee = () => {
    console.log('Selecting all employee...\n');
    connection.query(`SELECT first_name, last_name
        FROM employee`, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.table(('All Employees'), res)
        start();
    })
}
// function to handle viewing departments
const viewDepartment = () => {
    console.log('Select all departments...\n');
    // const myQuery = `SELECT department.name
    // // FROM employee
    // // inner join role ON employee.id = role.id
    // // inner join department ON role.id = department.id`
    const myQuery = `SELECT department.name FROM department`
    connection.query(myQuery, (err, res) => {
        if (err) throw err;
        console.log(res);
        console.table(res)
        start();


    })
}

// view employees from a department
const employeeByDepartment = () => {
    inquirer
        .prompt({
            name: 'department',
            type: 'list',
            message: 'Which department would you like to view?',
            choices: ['Head Programing Engineer', 'Programing Engineer', 'Head Accoutant']
        }).then(answer => {
            // const firstQuery = `SELECT * FROM department WHERE name = "${answer.department}"`;

            // connection.query(firstQuery, (err, res) => {

            //     const secondQuery = `SELECT * FROM role WHERE department_id = ${res[0].id}`;

            //     connection.query(secondQuery, (err, res) => {

            //         if (err) throw err;
            //         console.log(res);
            //         console.table(res)
            //         start();

            //     })
            // })

            const oneQuery = `SELECT * FROM employee INNER JOIN (SELECT * FROM (SELECT department.name AS department_name, role.id AS role_id, role.title FROM department INNER JOIN role WHERE department.id = role.department_id) AS roleDept WHERE roleDept.department_name = "${answer.department}") AS myTable WHERE myTable.role_id = employee.role_id`;

            connection.query(oneQuery, (err, res) => {

                if (err) throw err;
                console.log(res);
                console.table(res)
                start();

            })
        })
}

// function to handle viewing roles
const viewRole = () => {
    console.log('Select employee by role...\n');
    connection.query(`SELECT role.title
    FROM employee
    inner join role ON employee.id = role.id`, (err, res) => {
        if (err) throw err;
        console.log(res);
        console.table(res)
        start();
    });
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
        ])
        .then((answer) => {
            // when finished prompting, insert a new employee into the db with that info
            connection.query(
                `INSERT INTO employee (first_name, last_name) VALUE (?, ?)`,
                [answer.firstName, answer.lastName],
                (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
        });
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'addDepart',
                type: 'input',
                message: 'Please enter name of new department.'
            },
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO department (department.name, role_id, department_id)
                SELECT role.id 
                FROM employee 
                WHERE first_name = ? VALUE ?`,
                {
                    department_name: answer.addDepart
                }
            );
            (err, res) => {
                if (err) throw err;
                console.table(res);
                connection.end();
            };
        });
}
const addRole = () => {
    inquirer
        .prompt([
            {
                name: 'addRole',
                type: 'input',
                message: 'Please enter name of new department.'
            },
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO role (role.title, role_id)
                SELECT role.id 
                FROM employee 
                WHERE first_name = ? VALUE ?`,
                {
                    role_title: answer.addRole
                }
            );
            (err, res) => {
                if (err) throw err;
                console.table(res);
                connection.end();
            };
        });

}

const updateRole = () => {
    console.log('Update employee role.../n')
    connection.query('SELECT FROM', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    }); return start();
}
