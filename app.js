//jshint esversion :6

const express = require("express");
const bodyParser =require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine",'ejs');

let items=[];
let workitems=[];
let day = date.getDay();

app.get("/",function(req,res){
    
    res.render("index",{
        listTitle : "Home", 
        Day : day,
        newitems : items
    });
});

app.get("/work",function(req,res){
    res.render("index",{
        listTitle : "Work",
        Day : day,
        newitems : workitems
    })
})

app.post("/",function(req,res){
    // console.log(req.body);
    let list = req.body.list;
    let it = req.body.newItem;

    if(list === "Work"){
        workitems.push(it);
        res.redirect("/work");
    }

    else{
        items.push(it);
        res.redirect("/");
    }
})

app.listen(port,function(){
    console.log("Running on "+port);
});