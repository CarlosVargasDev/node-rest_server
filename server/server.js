require('./config/config')

const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(require('./routes/usuario'));


// conection = mongoose.connect('mongodb://localhost:27017/cafe', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// console.log(conection);
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Base de datos conectada');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
})