# CakeWorks

I developed this inventory tracking system for confectioneries, but it can be used in any other industry.

Tables can be created for the main production phases and these tables can be edited and deleted. The same is the case with individual products within the tables.

With the help of drag&drop, you can move the products between the individual phases, according to the completion of the product.

It is also possible to change the order, both for tables and for individual products.

Employees can also log in to the system if they use a product for personal use, so it is possible to track, for example, the cafeteria used.

In all cases, the data is stored in a database.

## Requirements to use the inventory tracking system
1. Install PyCharm Professional:
https://www.jetbrains.com/help/pycharm/installation-guide.html#requirements

  2. a) Set Up a PostgreSQL Database on Linux
https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL_Linux.htm

  2. b) Set Up a PostgreSQL Database on Windows
https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm

  2. c) Set Up a PostgreSQL Database on MAC
https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/

3. Open a project in PyCharm
https://www.jetbrains.com/help/pycharm/open-projects.html

4. Configure environment variables
Click "Run" -> "Edit Configurations" -> "Environment Variables". 
Fill it out:
MY_PSQL_DBNAME = Your database name;
MY_PSQL_PASSWORD = Your psql password;
MY_PSQL_USER = Your psql username;

6. Run the project and go to http://localhost:5000/.
Used technologies:
JavaScript, HTML, CSS, Python, Python Flask, SQL, Git, GitHub.
