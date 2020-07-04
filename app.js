const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session) 
const connectDB = require('./config/db')


//Load config file
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body Parser
app.use(express.urlencoded({ extended:false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Logging
if(process.env.NODE_ENV==='development'){
    //add the morgan middleware
    app.use(morgan('dev'))
}

//Handlebar Helpers
const { formatDate,truncate,stripTags,editIcon,select } = require('./helpers/hbs')


//Handlebars
app.engine('.hbs', exphbs({ 
    helpers: { 
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
    }, 
    defaultLayout:'main' , extname: '.hbs'}));
    app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, //dont create a session until something is stored
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // to store current session in db so that it does not log out until we want
    //mongoose.connection gives the current mongoose connection 
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set exresss Global Variable for loggedin user to access in views/stories/index.hbs
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})


//Static folder
app.use(express.static(__dirname+'/public'))


//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))


const PORT = process.env.PORT || 3000
 
app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`))