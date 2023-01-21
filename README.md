
# Marketplacer

A solution to Marketplacer's coding challenge. This shopping cart project is composed of 3 main components:
* **Server** - created using NodeJS + Express + Docker
* **Database** - created using MySQL + Stored Procedures + Docker
* **Client CLI** - created using NodeJS + Inquirer






## Author

- [Lyzer Merck Bautista](https://www.github.com/mercklyzer)


## Features
**Required Features:**
- Load a list of products from a file.
- List product details to the user.
- Add products to a Shopping Cart.
- Apply promotional discounts.
- Calculate and display the total cost.
**Added Feature:**
- Remove an item from the Shopping Cart.
## Installation

The project is running on the following environment:
- WSL 2 (Ubuntu on Windows)
- Docker version 20.10.17, build 100c701
- Node v.16.9.1 (for Client CLI)

Clone the repository.

```bash
  git clone https://github.com/mercklyzer/marketplacer.git marketplacer
  cd marketplacer
```

Install dependencies for both client and server.
```bash
    cd marketplacer_client
    npm i
    cd ../marketplacer_server
    npm i
```

Start Docker. In my case, I open Docker Desktop. Wait for it to finish initializing.
In the terminal (WSL 2), make sure that you are in the marketplacer directory. If you are following the instructions above, you may use the command
```bash
    cd ..
```
Run the services from the docker-compose.yml file by typing
```bash
    docker-compose up
```
You may verify in the logs that the database(MySQL) will be the first one to be ready and this will be followed by the server(NodeJS).
After making sure that both the database and server are ready, we may start running the client. Open a new terminal (do not close the current terminal), and go to the marketplacer/marketplacer_client directory and type the following to run the client CLI.
```bash
    npm start
```
**Voila! The database, server, and client are now ready to take actions from the user.**

    
## Server and Database
Both the server and database are containerized in Docker and can be ran using the command `docker-compose up`. The specifications of the services are found in the `docker-compose.yml`. To ensure that the database is ready before the server starts, a script `start.sh` is run.

### Server
The base code of the server is written in **NodeJS** and **Express**. To be more specific, the initial files are generated using [express-generator](https://expressjs.com/en/starter/generator.html).

The server follows the **Model-View-Controller(MVC)** Architectural Pattern wherein the application is divided into 3 major components:
- Model - in this project, the model is renamed as repository. The repository is responsible for directly communicating with the database using [knex](https://knexjs.org/).
- View - in this project, the view or the component that is responsible in presenting data to the user, is not utilized because we have our dedicated client CLI.
- Controller - in this project, the controller is responsible in handling the request of the user and reponds with the appropriate data after communicating with the repository.

**Dependency Injection** is also implemented particularly on repositories being injected to the controllers. Because of this, unit testing is easier since we can simply create mocked repositories so that we don't have to directly affect the database during testing.

Having an experience in C#, I decided to implement my interpretation of **Singleton** Pattern in *productsRepository*, *productsController*, *shoppingCartRepository*, and *shoppingCartController*. Because of this, we can easily access them anywhere in the application.

### Database
The database used is **MySQL** which is a relational database. In this project, I decided to implement a flat table database. **Flat Table Database** avoids having table joins which can be a slow process especially in large tables. With Flat Table Database, we are only accessing a single table in our **SELECT** queries. This is possible by having redundant columns tables that we are accessing. 

In this project, the table **products** have the fields *productId*, *productName*, and *productPrice*. On the other hand, the table **shoppingCartItems** contains all fields present in the products table. In a normal approach in a relational database, you would set productId as a foreign key in the shoppingCartItems that points to the entries in the products table and use table join to access other fields of products.

With Flat Table Database, read transactions may be significantly faster. However, the trade-off is that it is the responsibility of the developer to maintain data intergrity especially on write transactions to multiple tables.
[More info about Flat Table Database](https://www.saperium.com/articles/flat-tables-databases)


For the schema, we only have 2 tables.
- **Products Table**
    - productId - generated using nanoid of 12 characters (Primary Key)
    - productName - string
    - productPrice - decimal
- **Shopping Cart Items Table**
    - shoppingCartItemId - generated using nanoid of 12 characters (Primary Key)
    - username - string (owner of the shopping cart item)
    - productId - primary key of the products table
    - productName - coming from the products table
    - productPrice - coming  from the products table
    - createdAt - BIGINT / unix, represents the unix timestamp when the item was added to cart
    



## Client CLI

The Client CLI is written in **NodeJS**. To make it interactive, [Inquirer](https://www.npmjs.com/package/inquirer) is used for prompts. To enable the client to send HTTP requests to the server, [axios](https://www.npmjs.com/package/axios) is used.

The features of the Client CLI is laid out in the flowchart below.

![alt-text](https://scontent.fmnl8-3.fna.fbcdn.net/v/t1.15752-9/324975396_416699330639699_4690319409331062571_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=jaqoxGclaOYAX9YzYtp&_nc_oc=AQk06DruDErpI1Lg30gJK2cpkTscCX1O0m7lCVb9voh0UTdfxXZG_zfoLn2iRM_52dA5_HAlXovJDXL3HcRRgwU2&_nc_ht=scontent.fmnl8-3.fna&oh=03_AdRd6iX0cg_TlkEheN9HFjynpmG-Pt2tRJ1vMNiJyqEpCA&oe=63F21257)

For the file structure, **client.js** is the entrypoint of the application. It calls the *main prompt* which is responsible in clearing of logs in the beginning, displaying welcome greetings, asking for username. The *operations prompt* file on the other hand, contains 3 main prompts:
- **Actions Prompt** - contains prompt that is responsible for selecting actions.
- **Products Prompt** - contains prompt that is responsible for listing of products and buying a product.
- **Shopping Cart Prompt** - contains prompt that is responsible in displaying the items in the shopping cart, and removing an item from the shopping cart.

## Running Tests

Unit tests for the shopping cart controller (server) is written in [Jasmine](https://www.npmjs.com/package/jasmine). To run it, make sure that you are in the `marketplacer/marketplacer_server` directory. Run the command:

```bash
  npm run test:unit
```

