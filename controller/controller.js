var Workflow=require('./../models/workflow');
const yaml = require('js-yaml');
//var mongo=require('mongodb');
var mongo=require('mongodb');
var url = "mongodb://localhost:27017/workflowsandlanpacks";
const fs = require('fs');
var Jobs=require('./../models/jobs');
const client = require('../redisClient').duplicate();
 const spawn = require('child_process').spawn;




//
//
// var get=function(req,res){
// 	var tag=req.query.search_item;
// 	console.log("tagsss   "+tag);
// 	var t=tag.split(',');
// 	console.log(t);
//  	Workflow.find({ $or :[{"tags":{"$all":t}},{"workflow_name":t}]},function(err,docs){
//     if(err){
// 			res.status(500);
// 			res.send("Internal errr");
// 			}
// 			else{
// 					console.log("result of server ");
// 					console.log(docs);
// 					res.json(docs);
// 			}
// 	})
// }


var get=function(req,res){

 var key=Object.keys(req.query);
  //     movie.find({tags:{$in:tags}},
  //console.log(req.query[key[0]]);
  console.log(req.query[key]);
  var x=typeof(req.query[key]);
  console.log(x);
  console.log("inside creator");
  if (x=='string') {

   Workflow.find({$or:[{workflow_name: { $in: req.query[key]}},{creator: {$in:req.query[key] }},{tags:{$all: req.query[key]}}]},

     function(err,mov){
       if (err) {
         res.status(500);
         res.send('internal server error');
       }
       else {

        res.status(200);
        console.log(mov);
         res.json(mov);

      }
     }
     )
  }
  else{
   Workflow.find({tags:{$in: req.query[key]}},

   function(err,mov){
     if (err) {
       res.status(500);
       res.send('internal server error');
     }
     else {

      res.status(200);
       res.json(mov);

    }
   }
   )
 }


};

var get1=function(req,res){
	var name=req.query.name;
	console.log("name   "+name);

 	Workflow.find({"workflow_name":name},function(err,docs){
    if(err){
			res.status(500);
			res.send("Internal errr");
			}
			else{
					console.log("result of server ");
					console.log(docs);
					res.json(docs);
			}
	})
}
// var add=function(req,res){
//    var movie=new Movie(req.body);
//    movie.save(function(err){
//    	if(err){
//    		res.status(500);
//    		res.send("Failed");
//    	}
//    	else
//    	{
//    		res.status(201);
//    		res.send(movie);
//    	}
//  })
// }
var add = function(req,res){
			 var workflow = new Workflow(req.body);
			 console.log(req.body);
			 var json = yaml.safeLoad(req.body.text);
		//console.log("name is  "+req.body.workflowName);
			 var item={
									 workflow_name: req.body.workflowName,
									 creator: req.body.creatorName,
									 description: req.body.description,
									 tags:req.body.tags,
									 workflows:json


			 };
			 mongo.connect(url,function(err,db)
			 {
					 db.collection('workflows').insertOne(item,function(err, result) {
									 if (err) {
											 console.log('---- DB add error <<=== ' + err + ' ===>>');
									 } else {
											 console.log("+-+- Workflow add status(+1-0) <<=== " + result.result.n + " ===>>");
											 res.send('Successfully added.');
											 db.close();
									 }
							 })



					 });


	 }




	 var stage=function(req,res){
		 console.log("in stage ");
	   const stagesKey = req.query.jobId + ':stages';
	   client.hgetall(stagesKey, (err, replyMap) => {
	     if(err) { console.error('Error Retrieving Stages:', err); return; }
	     console.log(stagesKey);
	     console.log(replyMap);
	     // const stages = convertHgetReplyToObject(replyMap);
	     // console.log("stages ====> "+stages);
	     res.send(replyMap);
	   });
	 }




	var job= function(req,res){
	 	Jobs.find({},function(err,docs){
	      if(err){
	 	res.status(500);
	 	res.send("Internal errr");
	 }else{
	 	//console.log(docs);
	     res.json(docs);
	     }})
	 }



	  var addGitRepo=function(req,res){

				console.log("in asdsadsa");

     var repo_name=req.body.languagepackName;

			 console.log(repo_name);


			}



			          	var addLang = function(req,res){

							// var languagepack = new LanguagePack(req.body);

							 console.log(req.body);

							 var repo_url=req.body.repo_url;

							 console.log(repo_url);

						 var meta={

									 creator: req.body.creatorName,

									 description: req.body.description,

									 tags:req.body.tags,

									version:req.body.version,

									languagepackName:req.body.languagepackName
							 }

							// createLangPack(req.body.creatorName,req.body.languagepackName,meta,req.body.list);

							 pushCode("first Commmit",repo_url,req.body.creatorName,req.body.languagepackName,meta,req.body.list);


				};





var createLangPack = function createLangPack(creator, lpname, meta,list) {

  console.log("asasasasasasasasasas");

    var filedata = JSON.stringify(meta);

    const spawn = require('child_process').spawn



   try {

        var ls = spawn('mkdir', [creator, creator + '/' + lpname])

        spawn('git', ['init', creator + '/' + lpname])







       ls.on('close', code => {

            console.log(`child process exited with code ${code}`);

						var path = './' + creator + '/' + lpname + '/';

             url1 = './' + creator + '/' + lpname + '/' + 'meta' + '.txt';

            var fileWriter = fs.createWriteStream(url1, 'utf8');

            fileWriter.write(filedata);

						list.map((a,e)=>

					 {

					 	createFile(path,a.item,a.code);

					 })

        });

    } catch (ex) {

        console.log('Error')

    }



}





var deleteLangPack = function deleteLangPack(creator,lpname,filename) {



		var path = './' + creator + '/' + lpname + '/' + filename + '.sh';

		console.log(path);



			fs.unlink(path, (err) => {

			  if (err)

					throw err;

	  			console.log('successfully deleted /tmp/hello');

	   		});

	}



var createFile=function createFile(path,fname,code)

{

	  console.log("url is  "+path);

     path1=path;

		path1=path1+fname+'.sh';

		var fileWriter = fs.createWriteStream(path1, 'utf8');

		fileWriter.write(code);;





}


var del = function(req,res) {



				var creator = req.body.creatorName;

				var languagepackName = req.body.languagepackName;

				var filename = req.body.filename;

        console.log(filename);

				deleteLangPack(req.body.creatorName,req.body.languagepackName,req.body.filename);

		}





	 var delete1 = function(req,res){

             mongo.connect(url, function(err, db) {
        if (err) {
            console.log('---- DB connection error <<=== ' + err + ' ===>>');
        } else {
            db.collection('workflows').deleteOne({
                workflow_name: req.body.workflowName
            }, function(err, result) {
                if (err) {
                    console.log('---- DB deletion error <<=== ' + err + ' ===>>');
                } else {
                    console.log("+-+- Workflow delete status(+1-0) <<=== " + result.result.n + " ===>>");
                    res.send('Successfully deleted.');
                    db.close();
                }
            }); // end of delete
        }
    });
        }

///////////////////////////////////////////




var pushCode = function pushCode(msg,repo,cname,lname,meta,list) {
try {

var dir=process.cwd();
	console.log("The starting  directory is " + process.cwd());

fs.mkdir(lname);

console.log("THIS IS WHERE WE ARE TRYING TO GO", process.cwd()+'/'+lname+'/');

process.chdir(process.cwd()+'/'+lname+'/');
console.log('Now this is our directory  ', process.cwd());


     var ls =spawn('git', ['clone',repo])
	     //spawn('cd', ["userDetails"])
var repo1='/'+repo;
   console.log("REPOSITORY========================", repo1);
// var dir1=process.cwd();

//console.log("dir ",process.cwd());
 var dir1=dir+"/"+lname;
 console.log('this is where we are tying to go', dir1);

	process.chdir(dir1);
 	console.log("The new working directory is " + process.cwd());

   list.map((a,e)=>
  {
 	 fs.writeFile(a.item, a.code, (err) => {
 	 if (err) throw err;

 	           spawn('git', ['add','.'])
 	 					 spawn('git', ['commit','-m',msg])
 	 					 spawn('git', ['remote','add','origin',repo])
 						 spawn('git', ['push','-u','origin','master'])
 	  console.log('It\'s saved!');
 	 });
 })
   	 ls.on('close', code => {
//
// 		//console.log(__dirname);
//\\

 process.chdir(dir);
// console.log("now directory after all proces is ",process.cwd());
// 		console.log(`child process exited with code ${code}`);

   	  });





	 } catch (err) {
 	    console.log('Error in this',err)
	 }

 	}




////////////////////////////////////////////




 module.exports ={

  	 add:add,

     	get:get,

		delete1:delete1,

		job:job,
		stage:stage,

		addLang:addLang,

		del:del,

		addGitRepo:addGitRepo,
		get1:get1


  }
