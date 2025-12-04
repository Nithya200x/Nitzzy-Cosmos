const mongoose = require('mongoose');
const colors = require('colors');
 const connectDB = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log(`Database connected successfully: ${mongoose.connection.host}`.bgMagenta.white);


        } catch (error) {
            console.error(`Error in database connection: ${error.message}`.bgRed.white);
        }
 };
 
 module.exports = connectDB;