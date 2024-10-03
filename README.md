
# **Inventory Management System API**

This project is a scalable and secure **Inventory Management System API** built using **NestJS**, **Prisma ORM**, **PostgreSQL**, and **Redis** for caching. It includes features such as product and category management, user authentication with JWT, caching with Redis, and security best practices.

## **Features**

- **JWT Authentication**: Secure authentication using JWT tokens.
- **User Roles**: Different roles (`ADMIN`, `MANAGER`, `STAFF`) with role-based access control.
- **Product Management**: CRUD operations for products with filtering and pagination.
- **Category Management**: CRUD operations for categories with nested categories.
- **Inventory Management**: Handling product inventory and logging inventory changes.
- **Redis Caching**: Caching product and category details for improved performance.
- **Error Handling**: Comprehensive error handling for user-friendly messages.
- **Rate Limiting**: Protection against brute-force and DDoS attacks.
- **Swagger Documentation**: Auto-generated API documentation.
- **Dockerized Setup**: Ready to run using Docker and Docker Compose.
- **Unit Tests**: Basic unit tests for key methods using Jest.

---

## **Prerequisites**

Before running this application, ensure you have the following installed:

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher
- **PostgreSQL**: Version 13.x or higher
- **Redis**: Version 6.x or higher (if running locally)
- **Docker**: Version 20.x or higher (optional, for containerization)

---

## **Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/inventory-management-system.git
   cd inventory-management-system
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

---

## **Environment Variables**

Create a `.env` file at the root of the project with the following values:

```bash
# .env file
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

Make sure to replace `your_jwt_secret` with a secure secret key.

---

## **Database Setup**

### **1. Setup PostgreSQL Database**

If PostgreSQL is running locally, create a new database for the application:

```sql
CREATE DATABASE inventory;
```

Alternatively, if you're using Docker, the PostgreSQL service is already configured in the `docker-compose.yml` file.

### **2. Run Prisma Migrations**

To set up the database schema, run the following command:

```bash
npx prisma migrate dev
```

This will apply the database migrations and set up the necessary tables.

---

## **Running the Application**

To start the application locally, run:

```bash
npm run start:dev
```

The API will be running at `http://localhost:3000`.

---

## **API Documentation (Swagger)**

The API documentation is auto-generated using Swagger and is accessible at:

```
http://localhost:3000/api
```

Here, you can explore all the available endpoints, including authentication, product management, category management, and more.

---

## **Redis Caching**

### **Caching Mechanism**

This project uses Redis to cache the results of the `findOne` methods for both **Products** and **Categories**. When a product or category is fetched by its ID, the result is stored in Redis for 5 minutes (`ttl: 300`). This improves performance for frequently accessed items.

### **Redis Setup**

To run Redis locally, ensure it's installed and running:

```bash
redis-server
```

If you're using Docker, the `docker-compose.yml` file already includes a Redis service, so Redis will run automatically.

---

## **Testing**

This project includes unit tests for the **Categories** service.

### **Running Tests**

To run tests, use the following command:

```bash
npm run test
```

This will execute the unit tests using Jest.

### **Example Test File: `categories.controller.spec.ts`**

Basic test coverage is included for the `CategoriesController`, testing the `findOne` method.

---

## **Docker Setup**

This project is fully dockerized, allowing you to run the application in containers along with PostgreSQL and Redis.

### **1. Build and Start Containers**

To build and start the application with Docker, run the following command:

```bash
docker-compose up --build
```

This will:

- Build the **NestJS** application.
- Start **PostgreSQL** and **Redis** services.
- Apply **Prisma** migrations automatically.

### **2. Access the Application**

Once the containers are running, the application will be accessible at `http://localhost:3000`.

---

## **Security Considerations**

### **1. Input Validation and Sanitization**

All input data is validated using **class-validator** to prevent injection attacks. Additionally, user inputs are sanitized to mitigate XSS attacks.

### **2. Protection Against SQL Injection**

Using **Prisma ORM**, all database queries are parameterized, protecting against SQL injection.

### **3. Protection Against XSS**

Sensitive user input is sanitized before being processed to protect against cross-site scripting (XSS) attacks.

### **4. Rate Limiting**

**Rate limiting** is implemented using `@nestjs/throttler` to protect against brute-force and DDoS attacks. By default, each IP address is limited to 10 requests per minute.

### **5. Security Headers**

The project uses **Helmet** to set secure HTTP headers, including Content Security Policy (CSP), to mitigate XSS and other web vulnerabilities.

### **6. Secure Authentication**

Authentication is handled using **JWT**, with user roles managed via **Role Guards**. JWT tokens are securely signed using a secret (`JWT_SECRET`), and their validity is time-limited.

---

## **Further Considerations**

### **1. Caching Invalidation**

When products or categories are updated or deleted, the corresponding Redis cache is invalidated to ensure data consistency.

### **2. Expand Test Coverage**

You can expand the unit tests by adding more test cases for other modules, such as **Products**, **Users**, and **Authentication**.

### **3. CI/CD Integration**

You can set up a **CI/CD pipeline** using GitHub Actions, Travis CI, or CircleCI for automated testing and deployment.

---

## **Troubleshooting**

### **1. Prisma Migration Issues**

If you encounter issues with Prisma migrations, reset the database and reapply migrations:

```bash
npx prisma migrate reset
```

### **2. Redis Connection Issues**

If Redis is not running, ensure that the Redis server is active:

```bash
redis-server
```

Or, use Docker to start the Redis service:

```bash
docker-compose up redis
```

---

## **Contributing**

Feel free to open a pull request or an issue if you'd like to contribute to the project. Contributions are welcome!

---

## **License**

This project is licensed under the MIT License.
    
    
## **How the Prisma Model Supports the Inventory System**

The provided **Prisma model** structure is designed to ensure flexibility, scalability, and accountability within the **Inventory Management System**. Here’s an in-depth look at how each model works and how it supports the overall system:

### **1. User Model**

The `User` model includes user information, role management, and relationships to the products they create or update and the inventory logs they affect.

- **Role-based Access**: The `role` field defines user roles such as `ADMIN`, `MANAGER`, and `STAFF`, which are used to control access to certain parts of the system.
- **Audit Trail**: By keeping track of which user created or updated a product and which user made inventory changes, we can easily maintain a full audit log.

This ensures secure access control and traceability in the system.

### **2. Category Model**

The `Category` model defines hierarchical relationships between categories, making it easy to manage a tree structure of nested categories.

- **Parent-Child Relationships**: Categories can be nested using the `parentCategory` and `subCategories` relations, allowing complex category structures like Electronics > Mobile Phones > Accessories.
- **Product Association**: Each category can be linked to multiple products, providing a clean and scalable way to categorize products.

This hierarchical structure is essential for organizing products into logical groups.

### **3. Product Model**

The `Product` model manages all product-related data, such as SKU, price, description, and the category to which the product belongs.

- **Unique SKU**: The `sku` field ensures that each product has a unique identifier, essential for inventory tracking.
- **Audit Trail**: The `createdBy` and `updatedBy` fields allow tracking of who added or modified a product, ensuring accountability.
- **Inventory and Inventory Logs**: The model is related to both the `Inventory` and `InventoryLog` models, ensuring that stock levels are tightly controlled and all changes are logged.

This provides an efficient way to manage products while maintaining full accountability for changes.

### **4. Inventory Model**

The `Inventory` model tracks the stock levels of products.

- **Product Stock**: Each `Inventory` record is linked to a product and tracks the current quantity available.
- **Unique Product Association**: A product can only have one corresponding inventory record, ensuring accurate stock levels at all times.

This model is vital for ensuring that product availability is accurately tracked.

### **5. InventoryLog Model**

The `InventoryLog` model keeps track of every inventory change made, providing a detailed audit trail.

- **Change Tracking**: The `changeType` field records whether the inventory was increased or decreased, and the `reason` field allows for additional explanation.
- **Accountability**: By linking each change to a user through the `changedBy` field, you can always see who made changes to inventory levels and why.

This ensures transparency and accountability in inventory management.

### **Enums**

- **Role Enum**: Defines the user roles (`ADMIN`, `MANAGER`, `STAFF`) and is used for access control.
- **ChangeType Enum**: Defines whether the inventory change was an increase or decrease.

---

### **Conclusion**

This Prisma model is perfectly suited for an inventory management system as it:

1. **Scales well** with a hierarchy of categories and products.
2. **Ensures data integrity** by using relations and unique constraints.
3. **Provides accountability** by linking users to changes in products and inventory.
4. **Supports flexibility** with the ability to deactivate products or manage nested categories.

By using this model, you can confidently build an inventory system that is both efficient and secure, with full transparency over stock levels and product management.
    