const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');

////create url
app.get('/', (req, res, next) =>{
    res.render('index2');
});

module.exports = app;