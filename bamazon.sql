
#Create the database.
create database bamazon;

#Create the products table.
use bamazon;
DROP  TABLE IF EXISTS
products;
use bamazon;
CREATE TABLE products (
item_id integer NOT NULL auto_increment,
PRIMARY KEY (item_id),
product_name varchar(200),
department_name varchar(200),
price decimal(16,2),
stock_quantity int
);

#populate the products table with test data.
use bamazon;
#1
insert into products (product_name,department_name,price,stock_quantity)
values ("rubiks cube","puzzles",7.99,1000);
#2
insert into products (product_name,department_name,price,stock_quantity)
values ("Acer Predator Helios 300 Gaming Laptop","laptops",1049.00,827);
#3
insert into products (product_name,department_name,price,stock_quantity)
values ("XFX Radeon RX 580 GTS","graphics cards",187.99,1177);
#4
insert into products (product_name,department_name,price,stock_quantity)
values ("Intel Core i7-8700K Desktop Processor","processor",396.99,928);
#5
insert into products (product_name,department_name,price,stock_quantity)
values ("MSI Z390-A PRO LGA1151","motherboard",119.99,46);
#6
insert into products (product_name,department_name,price,stock_quantity)
values ("Corsair Vengeance LPX 16GB ","computer memory",98.99,1038);
#7
insert into products (product_name,department_name,price,stock_quantity)
values ("CORSAIR Crystal 570X RGB Mid-Tower Case","computer case",159.98,409);
#8
insert into products (product_name,department_name,price,stock_quantity)
values ("CORSAIR Hydro Series H60 AIO Liquid CPU Cooler","cpu cooling",59.99,1192);
#9
insert into products (product_name,department_name,price,stock_quantity)
values ("ARCTIC MX-4 - Thermal Compound Paste","cpu cooling",9.99,757);
#10
insert into products (product_name,department_name,price,stock_quantity)
values ("Acer SB220Q bi","monitor",89.99,717);


#Create the departments table.
use bamazon;
CREATE TABLE departments (
department_id integer NOT NULL auto_increment,
PRIMARY KEY (department_id),
department_name varchar(200),
over_head_costs decimal(16,2)
);


#Add a new column to the products table.
use bamazon;
ALTER TABLE products
ADD COLUMN product_sales decimal(16,2) AFTER stock_quantity;


#popualte the departments table with department_name values from the products table.
use bamazon;
INSERT INTO departments (department_name)
  SELECT  distinct bamazon.products.department_name
  FROM products 
  
  use bamazon;
  update departments
  set over_head_costs = 100;
  
  
#The table used for supervisor view.  
use bamazon;
select d.department_id, d.department_name,
d.over_head_costs, p.product_sales, 
(p.product_sales - d.over_head_costs ) as total_profit
from departments d join
 (select department_name,sum(product_sales) as product_sales 
from products 
group by department_name) p
on d.department_name = p.department_name
#might be useful to add this where statment.
#where p.product_sales is not null




