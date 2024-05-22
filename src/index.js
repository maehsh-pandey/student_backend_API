// const express = require('express');
// require('dotenv').config();
// const app = express();

// app.listen(process.env.PORT, (error) => {
//         if (!error) {
//             console.log("Server is Successfully Running, and App is listening on port " + process.env.PORT);
//         } else {
//             console.log("Error occurred, server can't start", error);
//         }
//     }
// );

const express = require('express');
const { PORT,SESSION_SECRET } = require('./config');
const { databaseConnection } = require('./database/index');
const expressApp = require('./express-app');

const StartServer = async() => {

    const app = express();
 
    
    await databaseConnection();
    
    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();