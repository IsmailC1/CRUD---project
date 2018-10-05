var express         =  require("express"),
    methodOverride  = require("method-override"),
    app             =  express(),
    bodyParser      =  require("body-parser"),
    expressSanitizer= require("express-sanitizer"),
    mongoose        =  require("mongoose");
//App config
mongoose.connect("mongodb://localhost/books_app_demo");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));   
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var bookSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    author: String,
    created: {type: Date, default: Date.now}
});

var Book = mongoose.model("Book",bookSchema);

app.get("/",function(req, res){
    res.redirect("/books");
});


//Index Routes
app.get("/books",function(req, res){
    Book.find({},function(err,books){
        if(err){
            console.log("Error!");
        } else {
            res.render("index", {books: books});
        }
    });
});

//New Route
app.get("/books/new", function(req, res){
    res.render("new");
});
//Create Route
app.post("/books", function(req, res){
    console.log(req.body);
    console.log("======================");
    console.log(req.body);
     Book.create(req.body.blog,function(err, newBook){
         if(err){
             res.render("new");
         } else {
             res.redirect("/books");
         }
     });
});
//show route
app.get("/books/:id",function(req, res) {
    Book.findById(req.params.id, function(err,showTemp){
       if(err){
           res.redirect("/books");
       } else {
           res.render("show",{book:showTemp});
       }
    });
});
//Edit Route 
app.get("/books/:id/edit",function(req, res){
    Book.findById(req.params.id,function(err,foundBook){
        if(err){
            req.redirect("/books");
        }else {
            res.render("edit",{book:foundBook});
        }
    });
});
//Update Route
app.put("/books/:id",function(req, res){
                                  //(id ,      data,       ,err)
     req.body.blog.body = req.sanitize(req.body.blog.body)
    Book.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBook){
        if(err){
            req.redirect("/books");
        }else {
            res.redirect("/books/" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/books/:id", function(req,res){
  Book.findByIdAndRemove(req.params.id,function(err){
      if(err){
           res.redirect("/books");
         }else{
          res.redirect("/books");
        }
  });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});