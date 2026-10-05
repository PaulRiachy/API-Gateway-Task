# Node.js API Gateway Task

Simple API Gateway connecting multiple Node.js services.

## Services

* API Gateway: 3000
* Student Service: 3001
* Course Service: 3002
* Teacher Service: 3003

## Routes

```text
GET /students  -> Student Service
GET /courses   -> Course Service
GET /teachers  -> Teacher Service
```

All normal requests are sent through port 3000.

## Features

* Request routing
* Gateway logging
* Backend error handling
* Rate limiting
* JWT authentication for /teachers
* Third Teacher Service

## Testing

* Student and Course services were tested directly.
* Student and Course requests were successfully routed through the gateway.
* Teacher route was tested with a valid JWT.
* Rate limiting returned 429 Too Many Requests.
* Stopping a backend service returned a 502 error.
* Gateway logging was verified in the terminal.

## Run

Start each service in a separate terminal:

```bash
cd student-service
npm start
```

```bash
cd course-service
npm start
```

```bash
cd teacher-service
npm start
```

```bash
cd api-gateway
npm start
```

## Questions

### 1. What is an API Gateway?

A single entry point that receives client requests and forwards them to the correct backend service.

### 2. Why does the frontend call the gateway instead of each service directly?

It gives the frontend one common URL and hides the internal service addresses.

### 3. What is request routing?

The process of deciding which backend service should handle a request based on its URL.

### 4. What happens when one backend service is offline?

The gateway returns a 502 error instead of crashing.

### 5. What common functionality can be placed in a gateway?

Authentication, rate limiting, logging, routing, and error handling.

### 6. How is an API Gateway related to a reverse proxy?

Both receive client requests and forward them to backend servers. An API Gateway can additionally provide features such as authentication, rate limiting, and request management.
