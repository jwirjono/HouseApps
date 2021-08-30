const express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db');

const app = express();

//init Middleware
app.use(express.json({ extended: false }));

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/test', require('./routes/api/test'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))



//Used for starting web server
//npm run server