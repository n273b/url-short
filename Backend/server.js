const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')
const ShortUrl = require('./models/Url')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

// connect to mongodb
const port = process.env.PORT
mongoose.connect(process.env.URI) // returns a promise, hence async   
    .then((result) => app.listen(port, () => {
        console.log(`Server is running at port ${port}`)
    }))
    .catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs')

// middleware and static files
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', async (req, res) => {
    try {
        // url is defined within object as string input of object 'req.body' is then assigned to variable url
        const url = req.body.url
        const text = req.body.text
        console.log(text,url)
        // const textString = JSON.stringify(text);
        if(!url){
            throw new Error('Request body is empty')
        }

        // If custom shortid is provided
        if (text) {
            // Check if custom shortid already exists
            const customShortIdExists = await ShortUrl.findOne({ shortid: text });
            if (customShortIdExists) {
                throw new Error('Custom shortid already exists');
            }
            const shortUrl = new ShortUrl({ url: url, shortid: Text }); // Use custom shortid
            const result = await shortUrl.save();
            res.render('index', { short_url: `${req.headers.host}/${result.shortid}`, click_me: 'click this link' });
        } else {
            // If no custom shortid provided, generate one
            const shortUrl = new ShortUrl({ url: url, shortid: shortid.generate() });
            const result = await shortUrl.save();
            res.render('index', { short_url: `${req.headers.host}/${result.shortid}`, click_me: 'click this link' });
        }

        const urlExists = await ShortUrl.findOne({ url })
        if (urlExists) {
            res.render('index', { short_url: `${req.headers.host}/${urlExists.shortid}`, click_me: 'click this link' })
            return
        }
        // const shortUrl = new ShortUrl({ url: url, shortid: shortid.generate() })
        // const result = await shortUrl.save()
        // res.render('index', { short_url: `http://localhost:5000/${result.shortid}`, click_me: 'click this link' })
    } catch (error) {
        console.log('An error occurred:', error.message);
        res.status(400).send(error.message); // Send error response to client
    }
})

// app.post('/', async(req, res) => {
//     const {text} = req.body
//     if(!text){
//         console.log("Custom string filed is empty")
//     }else{
//         const result = await ShortUrl({ url: url, shortid: text })
//         res.render('index', { short_url: `http://localhost:5000/${result.shortid}`, click_me: 'click this link' })
//     }
// })

app.get('/:shortid', async(req, res) => {
    try {
        const { shortid } = req.params
        const result = await ShortUrl.findOne({ shortid: shortid })
        if(!result){
            throw new Error('No url exists')
        }
        res.redirect(result.url)
    } catch (error) {
        console.log('An error occurred:', error.message);        
    }
})

// Error handling
app.use((err, req, res) => {
    res.status(err.status || 500 )
    res.render('index', { error: err.message})
})