var data={
		Title:"Tulsa Open Source",
		Tagline:"",
		mainStyle:"css/bootstrap.css"
	}

var express = require('express')
 , cons = require('consolidate')
 , mongodb = require('mongodb')
 , ObjectId = mongodb.ObjectID
 , app = express();
 
var DBSERVER = process.env.DBSERVER;
var DBPASS = process.env.DBPASS;
var DBUSER = process.env.DBUSER;
var DBNAME = process.env.DBNAME;
var DBPORT = process.env.DBPORT;
 
var dbserver = new mongodb.Server(DBSERVER,DBPORT, {});
var db = new mongodb.Db(DBNAME, dbserver, {})

db.open(function(err,res){
  db.authenticate(DBUSER,DBPASS,function(err,res){
          if(err){
                  console.warn(err);
          }else{
                  console.log(res);
          }
  });
}); 

function stash(res,template,id){
	if(id){
		db.collection('posts').findOne({_id:new ObjectId(id)}, function(err,doc){
			console.log(doc);
			var toSend=data
			toSend.post=doc;
			res.render(template, toSend);
		});
	}else{
		db.collection('posts').find({}).toArray(function(err, docs) {
			docs.reverse()
			var toSend=data
			toSend.posts=docs
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
app.get('/', function(req, res){
  if(req.query.id){
	  stash(res,'post.html',req.query.id)
  }else{
	stash(res,'index.html',null);
  }
});


 

app.listen(process.env.PORT||3000);
