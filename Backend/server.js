const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')
const ShortUrl = require('./models/Url')

const app = express()

// connect to mongodb
const dbUri = "mongodb+srv://nishthabarnwal273:fuSHtest36@shorturls.fvgwg6d.mongodb.net/Url-shortener?retryWrites=true&w=majority&appName=shortUrls"
mongoose.connect(dbUri) // returns a promise, hence async   
    .then((result) => app.listen(5000, () => {
        console.log("Server is running at port 5000")
    }))
    .catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs')

// middleware and static files
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', async (req, res) => {
    try {
        const { url } = req.body
        if(!url){
            throw new Error('Request body is empty')
        }
        const urlExists = await ShortUrl.findOne({ url })
        if (urlExists) {
            res.render('index', { short_url: `http://localhost:5000/${urlExists.shortid}`})
            return
        }
        const shortUrl = new ShortUrl({ url: url, shortid: shortid.generate() })
        const result = await shortUrl.save()
        res.render('index', { short_url: `http://localhost:5000/${result.shortid}`})
    } catch (error) {
        console.log('An error occurred:', error.message);        
    }

})

// Error handling
app.use((err, req, res) => {
    res.status(err.status || 500 )
    res.render('index', { error: err.message})
})