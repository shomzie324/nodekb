const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check Connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

//Check for db errors
db.on('error', (err) => {
    console.log(err);
});

// init app
const app = express();

//Bring in Models
let Article = require('./models/article');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder for static assets
// will store css and image assets etc.
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', (req, res) => {
    // {} means find everything
    Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        } else {
        // add articles DB when rendering
        // so that pug can loop through it
        res.render('index', {
            title: 'Articles',
            articles: articles
        });
        }
    });
});

//get single article route
// ':' means placeholder value
app.get('/article/:id', (req, res) => {
    // gets the id from the article (i.e req)
    Article.findById(req.params.id, (err, article) => {
        //renders the 'article' template
        //and passes the article that was found in the reponse
        res.render('article', {
            article: article
        });
    });
});

//Add Route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

//Add Submit POST route
//note - same url can have different requests get/post
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    // adds information to new db record
    // if there is no error
    article.save((err) => {
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

//Load Edit Form
// ':' means placeholder value
app.get('/article/edit/:id', (req, res) => {
    // gets the id from the article (i.e req)
    Article.findById(req.params.id, (err, article) => {
        //renders the 'article' template
        //and passes the article that was found in the reponse
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

//Update Submit POST route
//note - same url can have different requests get/post
app.post('/articles/edit/:id', (req, res) => {
    //create empty Article object then set it's 
    //atributes to be what was entered in the edit form
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    //creates a query to find the record with given id
    // in the database
    let query = {_id:req.params.id}

    // updates info of existing db record
    //using query and the article obj from the edit form 
    // if there is no error
    Article.update(query, article, (err) => {
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.delete('/article/:id', (req, res) => {
    //url providing id to be queried
    let query = {_id:req.params.id}

    Article.remove(query, (err) => {
        if(err){
            console.log(err);
        }
        //By default remove sends 200 status
        // to say everything went OK
        res.send('Successfully Deleted');
    });
});

//start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});