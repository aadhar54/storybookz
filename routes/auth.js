const express = require('express')
const passport = require('passport')
const router = express.Router()
  

//@desc Auth with Google
//@route GET /auth/google
router.get('/google',passport.authenticate('google',{ scope:['profile']  }))
//scope profile means we are asking for profile data 


//@desc Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/'}),(req,res)=>{
    res.redirect('/dashboard')}
)

router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/')
})

module.exports = router // Try removing this .See if it works