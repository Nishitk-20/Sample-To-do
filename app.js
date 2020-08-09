//jshint esversion :6

const express = require("express");
const bodyParser =require("body-parser");
const mongoose =require("mongoose");
const _ = require("lodash");
// const date = require(__dirname+"/date.js");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine",'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB",{
    useNewUrlParser:true, 
    useUnifiedTopology: true,  
    useFindAndModify: false});


const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item",itemSchema);

const listSchema = new mongoose.Schema({
    name : String,
    items : [itemSchema]
});

const List = mongoose.model("List",listSchema);

const item1 = new Item({name : "Welcome to the to-do list"});
const item2 = new Item({name : "To add new Item click to +"});
const item3 = new Item({name : "<-- click here to delete an item"});

const defaultItems = [item1,item2,item3];



// let items=[];
// let workitems=[];
// let day = date.getDay();

app.get("/",function(req,res){
    
    // console.log(Item.find({}));
    Item.find({},function(err, foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully saved default.")
                }
            })
            res.redirect("/");
        }
        else{res.render("index",{
            listTitle : "Today", 
            // Day : day,
            newitems : foundItems})
    };
    });
});

app.get("/:custom",function(req,res){
    const customLname = _.capitalize(req.params.custom);
    List.findOne({name:customLname}, function(err,foundList)    
    {
        if(!err){
            
            if(!foundList)
            {
                // console.log("1");
                const l = new List({
                    name : customLname,
                    items : defaultItems
                    });

                    l.save();
                    res.redirect("/"+customLname);
            }
            
            else{
                res.render("index",{
                    listTitle:foundList.name,
                    newitems: foundList.items
                    })
                }
        }
        else{
            console.log(err);
        }
    })
})

app.post("/",function(req,res){
        
        const lname = req.body.list;

        
        const k = new Item({
            name: req.body.newItem
        });
        
        if(lname==="Today")
        {   
            k.save();
            res.redirect("/");
        }
        else{
            List.findOne({name:lname},function(err,foundList){
                    foundList.items.push(k);
                    foundList.save();
                    res.redirect("/"+lname);
            })
        }
        })

app.post("/delete",function(req,res){
    
    const checkedItem  = req.body.checkbox;
    const lname = req.body.list;
    
    
    if(lname=="Today"){
    Item.findByIdAndRemove(checkedItem,function(err){
        if(!err){
            res.redirect("/");
        }
        else{
            console.log(err);
        }
    }) 
    }
    else{
        List.findOneAndUpdate({name:lname},{$pull: {items :{ _id : checkedItem }}}, function(err,foundList){
            if(!err){
                    res.redirect("/"+lname);
                }
            }) 
        }
    }
)

app.listen(port,function(){
    console.log("Running on "+port);
});