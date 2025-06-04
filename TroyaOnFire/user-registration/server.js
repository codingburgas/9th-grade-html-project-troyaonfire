const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const saltRounds = 10;
const DATA_FILE = path.join(__dirname, 'users.json');


app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(bodyParser.json());

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password, country } = req.body;

  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const users = JSON.parse(data);

    const existingUser = users.find(user => user.email === email);
    if (existingUser) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { email, password: hashedPassword, country };
    users.push(newUser);

    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
    res.send('Registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).send('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid email or password');

    // Don't send the password back
    res.json({ email: user.email, country: user.country });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
