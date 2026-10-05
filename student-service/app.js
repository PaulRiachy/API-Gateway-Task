const express = require("express");

const app = express();
const PORT = 3001;

const students = [
    { id: 1, name: "John" },
    { id: 2, name: "Sarah" }
];

app.get("/students", (req, res) => {
    res.json(students);
});

app.listen(PORT, () => {
    console.log(`Student Service running on http://localhost:${PORT}`);
});