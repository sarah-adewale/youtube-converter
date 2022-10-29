//required packages
const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config()

//create express server
const app = express()

//server port number
const PORT = process.env.PORT || 3000

//set template engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

//parse html to parse data for post
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/convert-mp3', async (req, res) => {
    const videoId = req.body.videoID //grabs the value(videoID) from the input
    if(
        videoId === undefined || //if the id is invalid
        videoId === '' ||
        videoId === null
    ){
        return res.render('index', {success : false, message : 'please enter a video ID'}) //send a failure message
    }else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, { //else fetch the url
            'method' : 'GET',
            'headers': {
                'x-rapidapi-key' : process.env.API_KEY,
                'x-rapidapi-host' : process.env.API_HOST
            }
        })
        const fetchResponse = await fetchAPI.json() //convert to json

        if(fetchResponse.status === 'ok') //if the response is successful
            return res.render('index', {success: true, song_title: fetchResponse.title, song_link : fetchResponse.link}) //render success
        else
            return res.render('index', {success: false, message : fetchResponse.msg})//else render failure
        
    }
})
//Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})