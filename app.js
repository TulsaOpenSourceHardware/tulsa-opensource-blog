var data = {
    Title: "Tulsa Open Source",
    Tagline: "",
    mainStyle: "css/bootstrap.css",
    post: {},
    posts: []
}

const express = require('express'),
    cons = require('consolidate'),
    mongodb = require('mongodb'),
    ObjectId = mongodb.ObjectID;

var app = express();

const config = {
    dbServer: process.env.DBSERVER,
    dbPort: process.env.DBPORT,
    dbName: process.env.DBNAME,
    dbUser: process.env.DBUSER,
    dbPW: process.env.DBPASS,
}

var dbserver = new mongodb.Server(config.dbServer, config.dbPort, {});
var db = new mongodb.Db(config.dbName, dbserver, {})

db.open((err, res) => {
    db.authenticate(DBUSER, DBPASS, (err, res) => {
        if (err) {
            console.warn(err);
        } else console.log(res);
    });
}); 

/**
 * 
 * @param {Response} res
 * @param {string} template Path to Template File
 * @param {number | string} id
 */
function stash(res, template, id) {
    if (id) {
        db.collection('posts').findOne({ _id: new ObjectId(id) }, (err, doc) => {
            console.log(doc);
            var toSend = Object.assign({}, data); //Copy
            toSend.post = doc;
            res.render(template, toSend);
        });
    } else {
        db.collection('posts').find({}).toArray((err, docs) => {
            docs.reverse();
            var toSend = Object.assign({}, data); //Copy
            toSend.posts = docs;
            res.render('index', data);
        });
    }
}
 
// assign the mustache engine to .html files
app.engine('html', cons.mustache);
 
// set .html as the default extension
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/templates');
 
// test mustache
app.get('/', (req, res) => {
    if (req.query.id) {
        stash(res, 'post.html', req.query.id);
    } else stash(res, 'index.html', null);
});

app.listen(process.env.PORT || 3000);
