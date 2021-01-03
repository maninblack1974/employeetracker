const connection = require("./connection");

class DB {
    this.connection = connection;
}

async function getManagerNames() {
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";

    const rows = await db.query(query);
    //console.log("number of rows returned " + rows.length);
    let employeeNames = [];
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}

async function getRoles() {
    let query = "SELECT title FROM role";
    const rows = await db.query(query);
    //console.log("Number of rows returned: " + rows.length);

    let roles = [];
    for(const row of rows) {
        roles.push(row.title);
    }

    return roles;
}

async function getDepartmentNames() {
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    //console.log("Number of rows returned: " + rows.length);

    let departments = [];
    for(const row of rows) {
        departments.push(row.name);
    }

    return departments;
}

// Given the name of the department, what is its id?
async function getDepartmentId(departmentName) {
    let query = "SELECT * FROM department WHERE department.name=?";
    let args = [departmentName];
    const rows = await db.query(query, args);
    return rows[0].id;
}

// Given the name of the role, what is its id?
async function getRoleId(roleName) {
    let query = "SELECT * FROM role WHERE role.title=?";
    let args = [roleName];
    const rows = await db.query(query, args);
    return rows[0].id;
}

// need to find the employee.id of the named manager
async function getEmployeeId(fullName) {
    // First split the name into first name and last name
    let employee = getFirstAndLastName(fullName);

    let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
    let args=[employee[0], employee[1]];
    const rows = await db.query(query, args);
    return rows[0].id;
}

async function getEmployeeNames() {
    let query = "SELECT * FROM employee";

    const rows = await db.query(query);
    let employeeNames = [];
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}

async function viewAllRoles() {
    console.log("");
    // SELECT * FROM role;
    let query = "SELECT * FROM role";
    const rows = await db.query(query);
    console.table(rows);
    return rows;
}

async function viewAllDepartments() {
    // SELECT * from department;

    let query = "SELECT * FROM department";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewAllEmployees() {
    console.log("");

    // SELECT * FROM employee;
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewAllEmployeesByDepartment() {
    // View all employees by department
    // SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);
    console.log("");
    let query = "SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
    const rows = await db.query(query);
    console.table(rows);
}

// Will return an array with only two elements in it: 
// [first_name, last_name]
function getFirstAndLastName( fullName ) {
    // If a person has a space in their first name, such as "Mary Kay", 
    // then first_name needs to ignore that first space. 
    // Surnames generally do not have spaces in them so count the number
    // of elements in the array after the split and merge all before the last
    // element.
    let employee = fullName.split(" ");
    if(employee.length == 2) {
        return employee;
    }

    const last_name = employee[employee.length-1];
    let first_name = " ";
    for(let i=0; i<employee.length-1; i++) {
        first_name = first_name + employee[i] + " ";
    }
    return [first_name.trim(), last_name];
}

async function updateEmployeeRole(employeeInfo) {
    // Given the name of the role, what is the role id?
    // Given the full name of the employee, what is their first_name and last_name?
    // UPDATE employee SET role_id=1 WHERE employee.first_name='Mary Kay' AND employee.last_name='Ash';
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);

    let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
    let args=[roleId, employee[0], employee[1]];
    const rows = await db.query(query, args);
    console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
}

async function addEmployee(employeeInfo) {
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmployeeId(employeeInfo.manager);

    // INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Hope", 8, 5);
    let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
    const rows = await db.query(query, args);
    console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
}

async function removeEmployee(employeeInfo) {
    const employeeName = getFirstAndLastName(employeeInfo.employeeName);
    // DELETE from employee WHERE first_name="Cyrus" AND last_name="Smith";
    let query = "DELETE from employee WHERE first_name=? AND last_name=?";
    let args = [employeeName[0], employeeName[1]];
    const rows = await db.query(query, args);
    console.log(`Employee removed: ${employeeName[0]} ${employeeName[1]}`);
}

async function addDepartment(departmentInfo) {
    const departmentName = departmentInfo.departmentName;
    let query = 'INSERT into department (name) VALUES (?)';
    let args = [departmentName];
    const rows = await db.query(query, args);
    console.log(`Added department named ${departmentName}`);
}

async function addRole(roleInfo) {
    // INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 100000, 1);
    const departmentId = await getDepartmentId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
    let args = [title, salary, departmentId];
    const rows = await db.query(query, args);
    console.log(`Added role ${title}`);
}