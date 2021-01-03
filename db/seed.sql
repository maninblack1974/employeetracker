USE employeesDB;

INSERT INTO department 
	(name)
VALUES 
	('Sales'), 
    ('Engineering'), 
    ('Finance'), 
    ('Legal');

INSERT INTO role
	(title, salary, department_id)
VALUES 
	('Sales Lead', 100000, 1), 
    ('Salesperson', 80000, 1), 
    ('Lead Engineer', 150000, 2), 
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3), 
    ('Legal Team Lead', 250000, 4), 
    ('Lawyer', 190000, 4);

INSERT INTO employee 
	(first_name, last_name, role_id, manager_id) 
VALUES 
	('Michael', 'Scott', 1, null),
	('Jim', 'Halpert', 2, 1),
    ('Dwight', 'Schrute', 2, 1),
    ('Andy', 'Bernard', 2, 1), 
    ('Stanley', 'Hudson', 5, 1), 
    ('Darryl', 'Phibin', 3, null), 
    ('Ryan', 'Howard', 4, 6), 
    ('Phyllis', 'Vance', 5, 1),
    ('Kevin', 'Malone', 6, 1),
    ('Angela', 'Martin', 6, 1),
    ('Oscar', 'Martinez', 6, 1),
    ('Gabe', 'Lewis', 7, null),
    ('Pam', 'Halpert', 8, 12),
    ('Creed', 'Bratton', 4, 6);
    