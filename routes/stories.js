const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

//@desc Show add page
//@route GET /stories/add
router.get('/add',ensureAuth,(req,res)=>{  
    try{
        res.render('stories/add')
    }
    catch(err){
        console.error(err)
        return res.redirect('error/500')
    }
})

//@desc Process add stories form 
//@route POST /stories
router.post('/',ensureAuth, async (req,res)=>{  
    try{
        req.body.user = req.user.id //user is reqd in ref for creating story
        await Story.create(req.body)
        res.redirect('/dashboard')
    }
    catch(err){
        console.error("ERROR IS ",err)
        return res.render('error/500')
    }
})

//@desc Show all stories
//@route GET /stories
router.get('/',ensureAuth,async (req,res)=>{  
    try{
        const stories = await Story.find({ status:'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
        res.render('stories/index',{
            stories
        })
    }
    catch(err){
        console.error(err)
        return res.render('error/500')
    }
})

//@desc Show single stroy
//@route GET /stories/:id
router.get('/:id',ensureAuth,async (req,res)=>{  
    try{
        let story = await Story.findById({
            _id:req.params.id
        }).populate('user').lean()

        if(!story){
            return res.render('error/404')
        }
        res.render('stories/show',{
            story
        })
    }
    catch(err){
        console.error(err)
        return res.redirect('error/404')
    }
})

//@desc Show edit page
//@route GET /stories/edit/:id
router.get('/edit/:id',ensureAuth,async (req,res)=>{  
    try{
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
        if(!story){
            res.render('error/500')
        }
        //To ensure only author can edit his own story
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story
            })
        }
    }
    catch(err){
        console.error(err)
        return res.redirect('error/500')
    }
    
})

//@desc  Update Story
//@route PUT /stories/:id
router.put('/:id',ensureAuth,async (req,res)=>{  
    try{
        let story = await Story.findById(req.params.id).lean()

        if(!story){
            return res.render('error/500')
        }
        if(story.user!=req.user.id){
            res.redirect('/stories')
        }else{
            story = await Story.findOneAndUpdate(
                { _id:req.params.id },req.body ,{
                    new:true,
                    runValidators:true
                }
            )
            res.redirect('/dashboard')
        }
    }
    catch(err){
        console.error(err)
        return res.redirect('error/500')
    }

})

//@desc Delete Story
//@route DELETE stories/:id
router.delete('/:id',ensureAuth,async (req,res)=>{  
    try{
        await Story.remove({
            _id:req.params.id
        })
        res.redirect('/dashboard')
    }
    catch(err){
        console.error(err)
        return res.redirect('error/500')
    }
})

//@desc Show USER stories
//@route GET /stories/user/:userId
router.get('/user/:userId',ensureAuth,async (req,res)=>{  
    try{
        const stories = await Story.find({
            user :req.params.userId,
            status:'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index',{
            stories
        })
    }
    catch(err){
        console.error(err)
        return res.redirect('error/500')
    }
})


module.exports = router 
