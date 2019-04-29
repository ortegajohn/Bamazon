# Bamazon
Node and SQL console inventory application.


### Overview

This is a simple command line application using npm inquirer and mysql packages to display inventory to the user and make changes to the datbase with user input. 

### Customer

Accessed by running `node bamazonCustomer.js`.  This command fist displays a table of products to buy and ask for the id of the item they want to select.  Next the user is prompted for a quantity.  After the quantity is selected a check is made against the existing inventory.  Given there was enough product in stock for the order the database is updated and a success message is returned.


### Manager View

Accessed by running `node bamazonManager.js`. This will return a list of menu options.

* View Products for Sale
    
* View Low Inventory
    
* Add to Inventory
    
* Add New Product

* Quit

The view options will display a table and return the user back to the menu.  The add options will update the database using input provided by the user and return the user back to the menu. Selecting Quit exits the application.

### Supervisor View

Accessed by running `node bamazonSupervisor.js`.  This will return a list of menu options. 

* View Product Sales by Department

 * Create New Department
 
 * Quit

The view option will display a table that is combines data from two tables giving a total of sales by department name. The create uption updates the database with information provided by the user.  Both the create and view options return the user to the menu.  Selecting Quit exits the application.
