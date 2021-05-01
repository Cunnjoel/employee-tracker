DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL (10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id),
  INDEX (department_id),
  FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  INDEX (role_id),
  FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX (manager_id),
  FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  PRIMARY KEY (id) 
);
SELECT * FROM employee;
select * from role;
select * from department;