const express = require('express')
const router = express.Router()
const { ensureAuth , ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

//@desc Login or Landing Page
//@route GET /
router.get('/',ensureGuest,(req,res)=>{  // Only a guest should be able to see login
    res.render('login',{
        layout:'login'
    })
})

//@desc DASHBOARD
//@route GET /dashboard
router.get('/dashboard',ensureAuth, async (req,res)=>{ //only loggedin should see dash
    try{
        const stories = await Story.find({
            user : req.user.id
        }).lean() //lean converts mongoosedocuments to jsobject to render to template
        res.render('dashboard',{
            name : req.user.firstName,
            stories
         })
    }
    catch(err){
        console.error(err)
        res.render('error/500')
    }

    
})


module.exports = router // Try removing this .See if it works