const express = require('express')
const app = express()
const port = 3000

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

//ROUTES

app.get('/', (req, res) => {
    res.render('layouts/home')
})

//LISTEN

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
