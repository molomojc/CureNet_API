const express = require('express');
const app = express();
const PORT = 5000;

// Add this line to parse JSON body
app.use(express.json());

app.post('/api/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    return res.status(200).json({ message: 'User registered successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
