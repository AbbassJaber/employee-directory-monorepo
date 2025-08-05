/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Employees
 *     description: Employee management operations
 *   - name: Miscellaneous
 *     description: Supporting data endpoints (departments, locations, permissions)
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Invalid credentials or validation error
 *       401:
 *         description: Authentication failed
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token from cookie
 *     tags: [Authentication]
 *     security: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/employees/reporting-managers:
 *   get:
 *     summary: Get list of employees who can be reporting managers
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reporting managers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get paginated list of employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for employee name or email
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         description: Filter by department ID
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: integer
 *         description: Filter by location ID
 *       - in: query
 *         name: reportsToId
 *         schema:
 *           type: integer
 *         description: Filter by reporting manager ID
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, email, position, department.name, location.name, reportsTo.firstName]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */

/**
 * @swagger
 * /api/v1/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - position
 *               - hireDate
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Employee email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Employee password
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: Employee first name
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: Employee last name
 *               phone:
 *                 type: string
 *                 description: Employee phone number
 *               position:
 *                 type: string
 *                 description: Employee position/title
 *               hireDate:
 *                 type: string
 *                 format: date
 *                 description: Employee hire date
 *               departmentId:
 *                 type: integer
 *                 description: Department ID
 *               locationId:
 *                 type: integer
 *                 description: Location ID
 *               reportsToId:
 *                 type: integer
 *                 description: Reporting manager ID
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of permission names
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Employee profile photo
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Validation error or invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Invalid employee ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: Employee first name
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: Employee last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Employee email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Employee password
 *               phone:
 *                 type: string
 *                 description: Employee phone number
 *               position:
 *                 type: string
 *                 description: Employee position/title
 *               hireDate:
 *                 type: string
 *                 format: date
 *                 description: Employee hire date
 *               departmentId:
 *                 type: integer
 *                 description: Department ID
 *               locationId:
 *                 type: integer
 *                 description: Location ID
 *               reportsToId:
 *                 type: integer
 *                 description: Reporting manager ID
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of permission names
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Employee profile photo
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Validation error or invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Employee not found
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete employee by ID (soft delete)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Employee deleted successfully
 *       400:
 *         description: Invalid employee ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /api/v1/employees/all:
 *   get:
 *     summary: Get all employees (non-paginated)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */

/**
 * @swagger
 * /api/v1/misc/permissions:
 *   get:
 *     summary: Get all available permissions
 *     tags: [Miscellaneous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/misc/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Miscellaneous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/misc/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Miscellaneous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       country:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
