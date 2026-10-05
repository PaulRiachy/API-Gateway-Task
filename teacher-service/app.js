const express = require("express");

const app = express();
const PORT = 3003;

const teachers = [
    { id: 1, name: "Mr. Smith" },
    { id: 2, name: "Ms. Johnson" }
];

app.get("/teachers", (req, res) => {
    res.json(teachers);
});

app.listen(PORT, () => {
    console.log(`Teacher Service running on http://localhost:${PORT}`);
});