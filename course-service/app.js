const express = require("express");

const app = express();
const PORT = 3002;

const courses = [
    { id: 1, name: "Node.js" },
    { id: 2, name: "React" }
];

app.get("/courses", (req, res) => {
    res.json(courses);
});

app.listen(PORT, () => {
    console.log(`Course Service running on http://localhost:${PORT}`);
});