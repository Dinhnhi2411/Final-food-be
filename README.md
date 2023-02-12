# Final-food-be

## EndPoint APIs

### Auth APIs

/\*\*

- @route POST /auth/login
- @description Log in with email and password
- @body {email, password}
- @access public
  \*/

  /\*\*

- @route POST /auth/google
- @description Log in with google
- @body {accessToken}
- @access public
  \*/

  /\*\*

- @route POST /auth/facebook
- @description Log in with facebook
- @body {accessToken}
- @access public
  \*/

### User APIs

#### Customer

/\*\*

- @route POST /users/customer
- @description Register new (user) customer
- @body {name, email, password}
- @access public
  \*/

/\*\*

- @route GET /users/me
- @description Get current user info
- @body
- @access Login required
  \*/

/\*\*

- @route GET /users/:id
- @description Get a user profile
- @access Login required
  \*/

/\*\*

- @route PUT /users/customer/:id
- @description Update customer profile
- n@body {name, avataUrl, address}
- @access Login required
  \*/

#### Seller

/\*\*

- @route GET /users
- @description Get all users
- @body
- @access Login required
  \*/

/\*\*

- @route DELETE /users/delete/:id
- @description Delete user
- @body
- @access Login requried
  \*/

/\*\*

- @route PUT /users/customer/:id
- @description Update customer profile
- @body {name, avataUrl, address}
- @access Login required
  \*/

### Product APIs

#### Public

/\*\*

- @route GET /products?page=1&limit=10
- @description Get all products with pagination
- @body
- @access public
  \*/

/\*\*

- @route GET /products/productsTopSelling?page=1&limit=10&name=`$productName`
- @description Get products top selling with pagination
- @access public
  \*/

/\*\*

- @route GET /products/productsNew?page=1&limit=10&name=`$productName`
- @description Get products new with pagination
- @access public
  \*/

/\*\*

- @route GET /products/productsDiscount?page=1&limit=10&name=`$productName`
- @description Get products top selling with pagination
- @access public \*

/\*\*

- @route GET /products/:id
- @description Get a product
- @body
- @access public \*

#### Seller

/\*\*

- @route GET /products?page=1&limit=10
- @description Get all products with pagination
- @body
- @access Login required
  \*/

/\*\*

- @route GET /products/:id
- @description Get a product
- @body
- @access Login required
  \*/

/\*\*

- @route POST /products
- @description Create a new products
- @body { name, image, description, types:[ Fruit, Vetgetable ], price, unit, amount }
- @access Admin Login required
  \*/

/\*\*

- @route PUT /products
- @description Update a new products
- @body {name, image, description, types:[ Fruit, Vetgetable ], price, unit, amount}
- @access Admin Login required
  \*/

/\*\*

- @route DELETE /products/:id
- @description Delete a product
- @body
- @access Login required
  \*/

### Cart APIs

/\*\*

- @route POST /carts/me
- @description Create a new cart
- @body { productId:Types.ObjectId, customerId:Types.ObjectId, amount }
- @access Seller Login required
  \*/

/\*\*

- @route GET /carts/me
- @description Get cart
- @body
- @access Login require
  \*/

/\*\*

- @route PUT /carts/me/:id
- @description Update a cart
- @body {amount}
- @access Admin Login required
  \*/

/\*\*

- @route DELETE /carts/:id
- @description Delete a cart
- @body
- @access Login required
  \*/

### Orders APIs

#### Customer

/\*\*

- @route POST /oders/me
- @description Create a new Oders
- @body { name, addressShip, phone, products, priceShip, total }
- @access Login required
  \*/

/\*\*

- @route GET /oders/me
- @description Get oders me
- @body
- @access Login required
  \*/

/\*\*

- @route GET /oders/me/:id
- @description Get oders by id
- @access Login required
  \*/

#### Seller

/\*\*

- @route GET /oders
- @description Get all oders
- @access Login required
  \*/

/\*\*

- @route GET /oders/me/:id
- @description Get a oder by id
- @access Login required
  \*/

/\*\*

- @route PUT /oders
- @description Update a oder
- @body {status}
- @access Admin Login required
  \*/

/\*\*

- @route DELETE /oders/:id
- @description Delete a oder
- @access Login required

## SET UP

1. Environment variable config (JSK, MURI) In .env in .gitignore
   > > JWT_SECRET_KEY=someKey
   > > MONGO_DEV_URI=mongodb://locahost:27017/
   > > MONGO_PRO_URI=mongodb_srv://atlas.com/

Run _npm run dev_ or _yarn dev_ to start backend
