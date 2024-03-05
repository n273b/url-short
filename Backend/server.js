const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())

// middleware and static files
app.use(express.static(path.join(__dirname, 'src')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes
app.get('/', (req, res) => {
    // You can send the .jsx file as a response
    res.sendFile(path.join(__dirname, 'src', 'main.jsx'));
})

//  ------404 page-------
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
})

mongoose.connect()

app.listen(5000, () => {
    console.log("Server is running at port 5000")
})