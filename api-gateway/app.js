require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const PORT = process.env.PORT;

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL;
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL;
const TEACHER_SERVICE_URL = process.env.TEACHER_SERVICE_URL;

const JWT_SECRET = process.env.JWT_SECRET;


app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});


const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests. Please try again later."
    }
});

app.use(limiter);


app.get("/", (req, res) => {
    res.json({
        message: "API Gateway is running"
    });
});


app.post("/auth/token", (req, res) => {
    const user = {
        id: 1,
        username: "admin",
        role: "admin"
    };

    const token = jwt.sign(user, JWT_SECRET, {
        expiresIn: "1h"
    });

    res.json({
        token
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Authorization header is required"
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            error: "Use Bearer token authentication"
        });
    }

    try {
        req.user = jwt.verify(parts[1], JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
}


app.use(
    createProxyMiddleware({
        target: STUDENT_SERVICE_URL,
        changeOrigin: true,
        pathFilter: "/students",

        on: {
            proxyReq: (proxyReq, req) => {
                console.log(
                    `Forwarding to Student Service: ${req.method} ${req.originalUrl}`
                );
            },

            error: (error, req, res) => {
                console.error(
                    `Student Service error: ${error.message}`
                );

                if (!res.headersSent) {
                    res.status(502).json({
                        error: "Student Service is unavailable"
                    });
                }
            }
        }
    })
);


app.use(
    createProxyMiddleware({
        target: COURSE_SERVICE_URL,
        changeOrigin: true,
        pathFilter: "/courses",

        on: {
            proxyReq: (proxyReq, req) => {
                console.log(
                    `Forwarding to Course Service: ${req.method} ${req.originalUrl}`
                );
            },

            error: (error, req, res) => {
                console.error(
                    `Course Service error: ${error.message}`
                );

                if (!res.headersSent) {
                    res.status(502).json({
                        error: "Course Service is unavailable"
                    });
                }
            }
        }
    })
);


app.use(
    authenticateToken,
    createProxyMiddleware({
        target: TEACHER_SERVICE_URL,
        changeOrigin: true,
        pathFilter: "/teachers",

        on: {
            proxyReq: (proxyReq, req) => {
                console.log(
                    `Forwarding to Teacher Service: ${req.method} ${req.originalUrl}`
                );
            },

            error: (error, req, res) => {
                console.error(
                    `Teacher Service error: ${error.message}`
                );

                if (!res.headersSent) {
                    res.status(502).json({
                        error: "Teacher Service is unavailable"
                    });
                }
            }
        }
    })
);


app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});


app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
    console.log(`Student Service: ${STUDENT_SERVICE_URL}`);
    console.log(`Course Service: ${COURSE_SERVICE_URL}`);
    console.log(`Teacher Service: ${TEACHER_SERVICE_URL}`);
});