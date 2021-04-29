DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;

USE employeeDB;

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  FOREIGN KEY (role_id),
  FOREIGN KEY INT (manager_id),
  PRIMARY KEY (id) 
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL (10,2) NULL,
  department_id INT NULL,
  FOREIGN KEY (department_id)
);

CREATE TABLE department (
    id INT NOt NULL,
    name VARCHAR(30) NULL
)

SELECT * FROM employee;
select * from role;
select * from department: