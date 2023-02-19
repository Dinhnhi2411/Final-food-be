# Final-food-be

## SET UP

1. Generate express boiler plate

   > npx express-generator --no-view
   > npm install
   > touch .gitignore .env

2. Install project dependencies

   > npm install

3. Environment variable config (JSK, MURI) In **.env** in **.gitignore**

   > JWT_SECRET_KEY=someKey
   > MONGO_DEV_URI=mongodb://locahost:27017/
   > MONGO_PRO_URI=mongodb_srv://atlas.com/

   In **.gitignore**

   > node_modules
   > .env

Run **npm run dev** or **yarn dev** to start backend

## EndPoint APIs

### Auth APIs

- @route POST /auth/login
- @description Log in with email and password

- @route POST /auth/google
- @description Log in with google

- @route POST /auth/facebook
- @description Log in with facebook

### User APIs

#### Customer

- @route POST /users/customer
- @description Register new (user) customer

- @route GET /users/me
- @description Get current user info

- @route GET /users/:id
- @description Get a user profile

- @route PUT /users/customer/:id
- @description Update customer profile

  \*/

#### Seller

- @route GET /users
- @description Get all users

- @route DELETE /users/delete/:id
- @description Delete user

- @route PUT /users/customer/:id
- @description Update customer profile

### Product APIs

#### Public

- @route GET /products?page=1&limit=10
- @description Get all products with pagination

- @route GET /products/productsTopSelling
- @description Get products top selling

- @route GET /products/productsNew
- @description Get products new

- @route GET /products/productsDiscount
- @description Get products top selling

- @route GET /products/:id
- @description Get a product

#### Seller

- @route GET /products?page=1&limit=10
- @description Get all products with pagination

- @route GET /products/:id
- @description Get a product

- @route POST /products
- @description Create a new products

- @route PUT /products
- @description Update a new products

- @route DELETE /products/:id
- @description Delete a product

### Cart APIs

- @route POST /carts/me
- @description Create a new cart

- @route GET /carts/me
- @description Get cart

- @route PUT /carts/me/:id
- @description Update a cart

- @route DELETE /carts/:id
- @description Delete a cart

### Orders APIs

#### Customer

- @route POST /oders/me
- @description Create a new Oders

- @route GET /oders/me
- @description Get oders me

- @route GET /oders/me/:id
- @description Get oders by id

#### Seller

- @route GET /oders
- @description Get all oders

- @route GET /oders/me/:id
- @description Get a oder by id

- @route PUT /oders
- @description Update a oder

- @route DELETE /oders/:id
- @description Delete a oder
