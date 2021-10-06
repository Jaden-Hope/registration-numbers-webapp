const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const { Pool } = require('pg');

let Factory = require('./regFactory');
let Routes = require('./regRoutes');

let app = express();

// const connectionString = process.env.DATABASE_URL || '';

// const pool = new Pool({
//     connectionString,
//     ssl: {
//         rejectUnauthorized: false,
//     }
// });

// pool.connect();

let factory = Factory(pool);
let regRoutes = Routes(pool, factory);

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true
}))

app.use(flash());

app.engine('handlebars', exphba({ defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', regRoutes.root);

app.get('/registration_numbers', regRoutes.regNumbers);

let PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});