# news-explorer-api
Graduation Project
Backend, API for authenticating users and saving articles

V 0.0.3


http://api.news-explorer-pr.tk
https://api.news-explorer-pr.tk

http://84.201.168.59/



## Installation
```bash
git clone https://github.com/Maliiya/news-explorer-api.git
```


## Usage

MongoDB is required

.env is required,
example:
```bash
//.env

NODE_ENV=production   //NODE_ENV=development
JWT_SECRET=12345
URL_DB = mongodb://localhost:27017/newsExplorerdb
```


```bash
npm i
```

```bash
npm run start
```

```bash
npm run dev (hot reload)
```


### Methods:
`GET` | `POST` | `DELETE`


**Requests:**
----

## * POST /signup

### **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ data : user }`

### **Error Response:**

  * **Code:** 400 ValidationError <br />
    **Content:** `{ message : err }`

  * **Code:** 409 ConflictError <br />
    **Content:** `{ message : err }`

  * **Code:** 500 InternalServerError <br />
    **Content:** `{ message : err }`
    

## * POST /signin

### **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ data : user }`
    **Content:** cookie (jwt)

### **Error Response:**

  * **Code:** 400 ValidationError <br />
    **Content:** `{ message : err }`

  * **Code:** 500 InternalServerError <br />
    **Content:** `{ message : err }`


## * GET /users/me

### **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ data : user }`

### **Error Response:**

  * **Code:** 400 СastError <br />
    **Content:** `{ message : err }`

  * **Code:** 401 Unauthorized <br />
    **Content:** `{ message : err }`

  * **Code:** 403 ForbiddenError <br />
    **Content:** `{ message : err }`

  * **Code:** 404 NotFoundError <br />
    **Content:** `{ message : err }`

  * **Code:** 500 InternalServerError <br />
    **Content:** `{ message : err }`


## * GET /articles

### **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ data : {} }`

### **Error Response:**

  * **Code:** 401 Unauthorized <br />
    **Content:** `{ message : err }`

  * **Code:** 500 InternalServerError <br />
    **Content:** `{ message : err }`


## * POST /articles

### **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ data : article }`

### **Error Response:**

  * **Code:** 400 ValidationError <br />
    **Content:** `{ message : err }`
    
  * **Code:** 401 Unauthorized <br />
    **Content:** `{ message : err }`

  * **Code:** 500 InternalServerError <br />
    **Content:** `{ message : err }`


## * DELETE /articles/:articleId

### **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ data : article }`

### **Error Response:**

  * **Code:** 400 СastError <br />
    **Content:** `{ message : err }`

  * **Code:** 401 Unauthorized <br />
    **Content:** `{ message : err }`

  * **Code:** 403 ForbiddenError <br />
    **Content:** `{ message : err }`

  * **Code:** 404 NotFoundError <br />
    **Content:** `{ message : err }`

  * **Code:** 500 InternalServerError <br />
    **Content:** `{ message : err }`
