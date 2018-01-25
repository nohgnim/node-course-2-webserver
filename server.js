const express = require('express')
const hbs = require('hbs') //Express handlebars engine
const fs = require('fs')
let app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

//This is how you register middleware
//Next tells express when the middleware is done
app.use((req, res, next) => {
    //log requests
    let userAgent = req.headers['user-agent']
    console.log(userAgent)
    let now = new Date().toString()
    let log = `${now}: ${req.method} ${req.url} \n${userAgent}`
    console.log(log)
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.')
        }
    })
    next()
})

//Put site into maintenance mode
// app.use((req,res,next) => {
//     res.render('maintenance.hbs')
// })

app.use(express.static(__dirname + '/public'))

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase()
})

//Route handlers
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>')
    res.render('index.hbs', {
        welcomeMsg: 'Welcome to my website!',
        name: 'Ming',
        likes: ['Biking', 'Guitar'],
        pageTitle: 'Home Page!'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page!',
    })
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request.'
    })
})
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})