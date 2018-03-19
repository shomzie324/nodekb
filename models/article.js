let mongoose = require('mongoose');

//Article Schema
//set database fields for database at app level
// mongoose is what makes this possible
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);