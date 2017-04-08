var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var searchRouter = require('./../routes/searchrouter');
var deleteRouter = require('./../routes/deleteRouter');
var jobRouter = require('./../routes/jobRouter');
var addRouter = require('./../routes/addRouter');
var stageRouter = require('./../routes/stageRouter');
var getRouter = require('./../routes/getRouter');
//var retrieveStages = require('./../services/retrieveAllStages');
const client = require('../redisClient').duplicate();
var addGitRouter = require('./../routes/addGitRouter');
var addLangRouter = require('./../routes/addLangRouter');

var mongoose = require('mongoose');
var Workflow = require('./../models/workflow');
var Jobs=require('./../models/jobs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var url = "mongodb://localhost:27017/workflowsandlanpacks";
mongoose.connect(url);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/',function(req,res){
	Workflow.find({},function(err,docs){
     if(err){
	res.status(500);
	res.send("Internal errr");


}
else{
	//console.log(docs);
    res.json(docs);
    }})
});

app.use('/stages',stageRouter);
app.use('/jobs',jobRouter);
app.use('/workflows/add',addRouter);
app.use('/workflows/get',getRouter);
app.use('/workflows/delete',deleteRouter);
app.use('/search',searchRouter);



app.use('/languagepack/add_git',addGitRouter);
app.use('/languagepack/add',addLangRouter);
app.listen(6007,function(){
    console.log("Started on PORT 6007");
})
