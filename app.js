const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE
  });
  db.connect( (error) => {
	if(error) {
	  console.log(error)
	} else {
	  console.log("MYSQL Connected...")
	}
  })
  


const app=express();
app.use(express.json());

app.get('/createdb',(req,res)=>{
	let sql='CREATE DATABASE FB';
	db.query(sql,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send('database created');
	});

});

app.get('/delete:id',(req,res)=>{
	let body=req.params.id;
	let sql='DELETE FROM fb_post WHERE id=?';
	db.query(sql,body,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send("id = "+body+" has been deleted");
	})
})

app.get('/liked:id',(req,res)=>{
		let body=req.params.id;
		console.log(body);
		let sql='UPDATE fb_post SET liked=liked+1 WHERE id=?';
		db.query(sql,body,(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send("id "+body+" has been liked" );
		})
})

app.get('/displaycomment:id',(req,res)=>{
	let body=req.params.id;
	let sql='SELECT comment,created_at from comment_fb_post where post_id=? ORDER BY created_at DESC';
	db.query(sql,body,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send(result);
	})
})

app.get('/comment:id',(req,res)=>{
	let body=req.body;
	let post_id=req.params.id;
	let sql='INSERT INTO comment_fb_post SET ?';
	db.query(sql,[{
		"comment": body.comment,
		"post_id": post_id
	}],(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send("Comment has been added in id "+post_id);
	})
})

app.get('/createcommenttable',(req,res)=>{
	let sql='CREATE TABLE comment_fb_post(c_id int AUTO_INCREMENT,comment VARCHAR(255),post_id int,created_at DATETIME,PRIMARY KEY(c_id))';
	db.query(sql,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send('comment table created');
	})
});

app.get('/createpost',(req,res)=>{
	let body=req.body;
	console.log(body);
	let sql='INSERT INTO fb_post SET ?';
	db.query(sql,body,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send('New Post has been Added');
	})
});



app.get('/createtable',(req,res)=>{
	let sql='CREATE TABLE fb_post(id int AUTO_INCREMENT,name VARCHAR(255),post VARCHAR(255),liked int,comment VARCHAR(255),PRIMARY KEY(id))';
	db.query(sql,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send('table created');
	})
});


app.listen('5000',()=>{
	console.log('Server started');
});