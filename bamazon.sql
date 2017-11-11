DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Fitbit Alta Fitness Tracker", "Electronics", 150, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Samsung Gear VR Headset", "Electronics", 99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES("Polaroid Cube+ Mini Action Camera", "Electronics", 141, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Smartphone Camera Lens", "Electronics", 20, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Cards Against Humanity", "Games", 25, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Hungry Hungry Hippos", "Games", 12, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Monopoly Board Game", "Games", 15, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES('Pikachu 9" Plush Toy', "Toys", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Rubik's Cube", "Toys", 10, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Yomega Brain Yo Yo", "Toys", 9, 35);