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
            switch (answer.begin) {
                case 'View All Employees':
                    viewEmployee();
                    break;
                case 'View All Employees By Department':
                    viewEmployeeDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewEmployeeManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Update Employee Manager':
                    updateManager();
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
    connection.query(`SELECT first_name, last_name, role.title, department.name
        FROM employee
        inner join role ON employee.id = role.id
        inner join department ON role.id = department.id`, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.table(('All Employees'), res)
        start();
    })
}

const viewEmployeeDepartment = () => {
    const departList = 'SELECT * FROM department';
    console.log('Selecting employee by department...\n');
    connection.query(departList, (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'departChoice',
                type: 'list',
                choices: function () {
                    let choiceArray = res.map(choice => choice.department_name)
                    return choiceArray;
                },
                message: 'Select a department to view: '
            }
        ]).then((answer) => {
            let chosenDepart;
            for (let i = 0; i < res.length; i++) {
                if (res[i].department_name === answer.departChoice) {
                    chosenDepart = res[i];
                }
            }
            connection.query('SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", r.salary AS "Salary" FROM employees e INNER JOIN roles r ON r.id = e.role_id INNER JOIN department d ON d.id = r.department_id WHERE ?;',
            { department_name: chosenDepart.department_name}, (err, res) => {
                if (err) throw err;
                console.log(' ');
                console.table((`All Employees by Department: ${chosenDepart.department_name}`), res)
                start();
            })
        })
    })
}

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
            // {
            //     name: 'manager',
            //     type: 'input',
            //     message: 'Who is the manager of the employee?',
            // },

        ])
        .then(async (answer) => {
            // when finished prompting, insert a new employee into the db with that info
            const query = await connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    // manager_id: answer.manager,
                }
            )
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.title,
                    salary: answer.salary
                }
            ),
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.name
                    }
                ),
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affrectedRows} was added successfully!`);
                    // re-prompt the user for if they want to bid or post
                    connection.end();
                }
            console.log(query.sql);
        });
    return start();
};

const removeEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'delete',
                type: 'input',
                message: 'Please enter employee name to remove.',
            },
        ])
        .then((answer) => {
            connection.query(
                'ON DELETE CASCADE From employee WHERE ?',
                {
                    first_name: answer.firstName
                }
            );
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} employee removed.\n`);
                connection.end();
            };
        });

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
}