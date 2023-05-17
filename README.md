# Online-Marketplace-Inventory-Management

set up the project

- clone the Project Repo: git@github.com:Ramadhan0/Online-Marketplace-Inventory-Management.git
- cd into the project
- run: `npm i` to install dependencies
- run: `docker-compose up -d` to start postgres and localstack
- run: `npm run dev` to run project
- run: `npm run test` to run tests

- configure local-stack profile: `aws configure --profile localstack`
- create SQS Queue: `aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name sqs-queue --profile localstack`
- create aws lambda: `aws --endpoint-url=http://localhost:4566 lambda create-function --function-name sqs-handler --runtime nodejs14.x --handler lambda.handler  --memory-size 128 --zip-file fileb://index.ts --role arn:aws:iam::000000000000:role/trigger`
- create an sns topic: `aws --endpoint-url=http://localhost:4566 sns create-topic --name notification`

### endpoints

#### user endpoints

- `http://localhost:3000/api/inventory/auth` Get all users
- `http://localhost:3000/api/inventory/auth/register` Register
- `http://localhost:3000/api/inventory/auth/login` Login
- `http://localhost:3000/api/inventory/auth/remove/:email` Delete user

#### products endpoints. Requires authentication

- `http://localhost:3000/api/inventory/products` Create product
- `http://localhost:3000/api/inventory/products` Get products
- `http://localhost:3000/api/inventory/products/my` Get My Products
- `http://localhost:3000/api/inventory/products/single/:id` Get single product
- `http://localhost:3000/api/inventory/products/:id` Update Product
- `http://localhost:3000/api/inventory/products/:id` Delete Product
