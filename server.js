const express = require('express')
const app = express()
const homeRoutes = require('./routes/home')

require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', homeRoutes)
 
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}!`)
})    