## Project created by:

- Sebastian Golatowski - Back-end developer
- Łukasz Janaszek - Front-end developer
- Hubert Getter - Project Meneger

## General Project Description:

The aim of the project is to create a modern web application that streamlines project management within teams. The system will enable intuitive creation and organization of projects, task assignment, efficient user management, and integration with a secure authentication system.

Our application is designed to increase work efficiency by centralizing all essential information in one place. This will allow team members to continuously add ideas, comment on and edit tasks, and collaborate in real time. A clear interface and modern technological solutions will make project management simpler, more dynamic, and conducive to productivity.

## Used Tools and Technologies:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Next.js](http://nextjs.org)
- [React.js](https://react.dev/)
- [JWT (JSON Web Token)](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org/en)
- [Material MUI Icons](https://mui.com/material-ui/material-icons/)
- [Material UI](https://mui.com/material-ui/)

## Getting Started

### Requirements for developer mode:

```text
Node.js v22.14.*
yarn package meneger
xampp mysql local server
### then:
create .env file with DATABASE_URL="your database url" variable
create .env.local file with JWT_SECRET="your secret key" variable
```

### Running development server:

```bash
node -v #check current Node.js version
yarn #installing dependecies from package.json
yarn dev #running developer server

```

Default developer server starts on [http://localhost:3000](http://localhost:3000)

## Project powered by [Next.js](http://nextjs.org)

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy:

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

### Docker

You can add [Docker](https://docker.com) files to this project, creating more efficient way to run project.

Check out [Docker deploy documentation](https://docs.docker.com/reference/compose-file/deploy/) to see how to prepare files and your server to deployment

# API PART
## Additional errors (they can show in any request you make):
##### **Status Code:** `401`
_Explanation: This error message may be caused if there is no Cookie, there is no token in the cookie, or the token is invalid_
##### **Status Code:** `403`
_Explanation: This will show when the user is no longer assigned to the project and wants to do something in its scope. When this happens, it will give a message in the response, like this:_
```json
   "message": "User not authorized to ${msg}"
```
##### **Status Code:** `405`
_Explanation: Endpoint does not allow this method_
##### **Status Code:** `500`
_Explanation: There is a problem with sending/retrieving to/from the DB_

## /api/auth/logout
- **GET**  
  _Description: Deletes the cookie so that on any other next request the user will be redirected to the login page (redirection is made on the frontend)_
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "message": "Logged out"
}
```

## /api/auth/user
- **GET**  
  _Description: Sends user data from JWT stored inside the cookie made on `POST`/`PUT` from this endpoint_
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "user": {
      "id": "<UUID>",
      "username": "<string>",
      "iat": "<integer>",
      "exp": "<integer>"
  }
}
```
#### Unsuccessful Response:
##### **Status Code:** `401`
```json
{
   "message": "Not authenticated" 
   OR 
   "message": "Invalid token"
}
```

- **POST**  
  _Description: Handles user login and creates JWT cookie_
#### Expected Parameters in Request body:
```json
{
   "username": "<string>",
   "password": "<string>"
}
```
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "message": "Login successful"
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Username and password are required"
}
```
##### **Status Code:** `401`
```json
{
   "message": "Invalid credentials"
}
```

- **PUT**  
  _Description: Handles user registration and creates JWT cookie after successful account creation_
#### Expected Parameters in Request body:
```json
{
   "username": "<string>",
   "password": "<string>",
   "secPassword": "<string>"
}
```
#### Successful Response:
##### **Status Code:** `201`
```json
{
   "message": "User created",
   "id": "<UUID>"
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Username and password are required"
   OR
   "message": "Passwords are not matching"
   OR
   "message": "Password does not meet requirements"
}
```
##### **Status Code:** `409`
```json
{
   "message": "Username is already taken"
}
```

## /api/coment/index
- **POST**  
  _Description: Creates comment_
#### Expected Parameters in Request body:
```json
{
   "taskId": "<string>",
   "projectId": "<string>",
   "body": "<string>"
}
```
#### Successful Response:
##### **Status Code:** `201`
```json
{
  "message": "Comment created successfully",
  "come": {
    "id": "<UUID>",
    "body": "<string>",
    "madeBy": "<UUID>",
    "taskId": "<UUID>",
    "createdAt": "<timestamp>"
  }
}
```
#### Unsuccessful Response:
##### **Status Code:** `400`
```json
{
   "message": "Missing taskId, projectId or comment body"
}
```

## /api/coment/[comId]
- **DELETE**  
  _Description: Deletes comment based on comId given in Path Parameter_
#### Successful Response:
##### **Status Code:** `200`
```json
{
  "message": "Comment deleted successfully"
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Invalid com ID"
}
```
##### **Status Code:** `403`
```json
{
   "message": "User cannot delete comment"
}
```
##### **Status Code:** `404`
```json
{
   "message": "Comment does not exist"
}
```

### /api/project/index
- **GET**  
  _Description: Gets all projects that the user is assigned to_
#### Successful Response:
##### **Status Code:** `200`
```json
[
  {
      "id": "<UUID>",
      "name": "<string>",
      "createdAt": "<timestamp>"
   }
]
```
- **POST**  
  _Description: Creates Project_
#### Expected Parameters in Request body:
```json
{
   "name": "<string>"
}
```
#### Successful Response:
##### **Status Code:** `201`
```json
{
  "project": {
    "id": "<UUID>",
    "name": "<string>",
    "createdAt": "<timestamp>"
  }
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "No name given"
}
```
##### **Status Code:** `409`
```json
{
   "message": "Project name already in use"
}
```

### /api/project/[projectId]
- **GET**  
  _Description: Gets all tasks for the project with included comments_
#### Successful Response:
##### **Status Code:** `200`
```json
{
  "tasks": [
    {
      "id": "<UUID>",
      "label": "<string>",
      "description": "<string>",
      "status": "<string>",
      "assignedTo": "<UUID>",
      "projectId": "<UUID>",
      "createdAt": "<timestamp>",
      "comments": [
        {
            "id": "<UUID>",
            "body": "<string>",
            "madeBy": "<UUID>",
            "taskId": "<UUID>",
            "createdAt": "<timestamp>"
        }
      ]
    }
  ]
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Invalid project ID"
}
```
##### **Status Code:** `404`
```json
{
   "message": "Project does not exist"
}
```

- **PATCH**  
  _Description: Updates Project_
#### Expected Parameters in Request body:
```json
{
   "name": "<string>"
}
```
#### Successful Response:
##### **Status Code:** `200`
```json
{
  "message": "Project updated successfully"
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Invalid project ID"
   OR
   "message": "Project name already in use"
}
```
##### **Status Code:** `404`
```json
{
   "message": "Project does not exist"
   OR
   "message": "No name given"
}
```

- **DELETE**  
  _Description: Deletes Project_
#### Successful Response:
##### **Status Code:** `200`
```json
{
  "message": "Project deleted successfully"
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Invalid project ID"
}
```
##### **Status Code:** `404`
```json
{
   "message": "Project does not exist"
}
```

### /api/task/index
- **POST**  
  _Description: Creates Task_
#### Expected Parameters in Request body:
```json
{
   "label": "<string>",
   "projectId": "<UUID>",
   "status": "<string>",
   "description": "<string>"
}
```
#### Successful Response:
##### **Status Code:** `201`
```json
{
   "message": "Task created successfully",
   "task": {
      "id": "<UUID>",
      "label": "<string>",
      "description": "<string>",
      "status": "<string>",
      "assignedTo": "<UUID>",
      "projectId": "<UUID>",
      "createdAt": "<timestamp>"
  }
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Missing/Invalid argument/s in request"
}
```

### /api/task/[taskId]
- **GET**  
  _Description: Gets task info including comments_
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "id": "<UUID>",
   "label": "<string>",
   "description": "<string>",
   "status": "<string>",
   "assignedTo": "<UUID>",
   "projectId": "<UUID>",
   "createdAt": "<timestamp>",
   "comments": [
      {
         "id": "<UUID>",
         "body": "<string>",
         "madeBy": "<UUID>",
         "taskId": "<UUID>",
         "createdAt": "<timestamp>"
      }
   ]
}
```
#### Unsuccessful Responses:
##### **Status Code:** `400`
```json
{
   "message": "Invalid or missing task ID"
}
```

- **PATCH**  
  _Description: Updates task based on what is given_
#### Expected Parameters in Request body:
```json
{
   "label": "<string>",
   "assignedTo": "<UUID>",
   "status": "<string>",
   "description": "<string>"
}
```

- **DELETE**  
  _Description: Deletes task_
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "message": "OK"
}
```

### /api/user/index
- **GET**  
  _Description: Get all users_
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "users": [
    {
      "id": "<UUID>",
      "username": "<string>",
      "password": "<string>",
      "imgBitmap": "<string>",
      "createdAt": "<timestamp>"
    }
  ]
}
```

- **POST**  
  _Description: Assign user to project_
#### Expected Parameters in Request body:
```json
{
   "projectId": "<UUID>", 
   "userId": "<UUID>"
}
```
#### Successful Response:
##### **Status Code:** `201`
```json
{
   "message": "Project assigned successfully"
}
```
#### Unsuccessful Response:
##### **Status Code:** `400`
```json
{
   "message": "Missing/Invalid argument/s in request"
}
```

- **DELETE**  
  _Description: Removes user from project_
#### Expected Parameters in Request body:
```json
{
   "projectId": "<UUID>", 
   "userId": "<UUID>"
}
```
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "message": "User deleted from project"
}
```
#### Unsuccessful Response:
##### **Status Code:** `400`
```json
{
   "message": "Missing/Invalid argument/s in request"
}
```

### /api/user/[projectId]
- **GET**  
  _Description: Gets all users assigned to the project with the ID from the path parameter_
#### Successful Response:
##### **Status Code:** `200`
```json
{
   "users": [
    {
      "id": "<UUID>",
      "username": "<string>",
      "password": "<string>",
      "imgBitmap": "<string>",
      "createdAt": "<timestamp>"
    }
  ]
}
```
