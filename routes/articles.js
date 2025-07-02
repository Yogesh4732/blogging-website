const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
// Route for About page
router.get('/about', (req, res) => {
    res.render('articles/about'); 
});

// Route for Contact Us page
router.get('/contact', (req, res) => {
    res.render('articles/contact'); 
});

// Route for Register page
router.get('/register', (req, res) => {
    res.render('articles/register'); 
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Here, you would typically create a new user in your database
        // For demonstration purposes, we'll create a new Article as if it's a user
        const article = new Article({
            title: username, 
            description: email, 
            markdown: password, 
            slug: 'sample-slug', 
            sanitizedHTML: 'sample-html' 
        });

        await article.save();
        res.render('articles/thank-you'); 
    } catch (error) {
        console.error(error);
        // Handle error, maybe render the registration page again with an error message
        res.render('articles/register', { error: 'Registration failed. Please try again.' });
    }
});

//thank-you route
router.get('/thank-you', (req, res) => {
    res.render('articles/thank-you'); // Render a thank you page without displaying user details
});

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async(req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })

})

router.post('/', async (req, res,next) => {
    req.article=new Article()
    next()
},saveArticle('new'))

router.put('/:id', async (req, res,next) => {
    req.article=await Article.findById(req.params.id)
    next()
},saveArticle('edit'))



router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticle(path){
    return async(req,res)=>{
    let article = req.article
        article.title= req.body.title
        article.description= req.body.description
        article.markdown= req.body.markdown
    
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e) {
        res.render(`articles/${path}`, { article: article })
    }
}}





module.exports = router
