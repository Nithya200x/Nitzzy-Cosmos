const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Config dotenv
dotenv.config();

// router impoert 
const userRoutes = require('./routers/userRouters'); 
const NitzzyRoutes = require('./routers/NitzzyRouters');

//mongoDB connection
connectDB();

// rest obj
const app = express();
// Middleware

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/user', userRoutes);    
app.use('/api/v1/nitzzy', NitzzyRoutes);

// Port
const PORT = process.env.PORT || 8080;
// Listen server
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} port no ${PORT}`.bgCyan.white);
});