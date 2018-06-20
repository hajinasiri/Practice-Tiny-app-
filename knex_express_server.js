var app_modules = require('./app_modules/app_modules.js')
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
const config = require('./knexfile.js')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(config);
app.use(cookieParser());
var cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//To make it possible to use external css:
app.use(express.static(__dirname + '/styles'));

app.use(cookieSession({
  name: 'session',
  keys: ["Hello"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//This function generates a 6 character string
function generateRandomString() {
  var shortString = "";
  var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (shortString.length < 6) {
      shortString += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }
  return(shortString);
}

//this function makes the entered url contain http:// in the begingin
function fixUrl (longURL) {
  let longRes = longURL.substr(0, 11);
  let shortRes = longURL.substr(0,4);
  if(longRes === "http://www."){
  }else if(shortRes === "www."){
    longURL= "http://" + longURL;
  }else{
    longURL = "http://www." + longURL
  }
  return longURL
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//To show all the urls
app.get("/urls", (req, res) => {
  let id = req.session.user_id;
  if(id){
    Promise.all([app_modules.getUserById(id), app_modules.getUrlsByUserId(id)]).then(vals => {
      let templateVars = {
        user: {
          id:id,
          email: vals[0][0].email
        },
        urls:vals[1]
      }
      res.render("urls_index", templateVars);
    })
  }else{
    let templateVars ={user:{}, urls:[]};
    res.render("urls_index", templateVars);
  }

});

// To render the page for adding new urls
app.get("/urls/new", (req, res) => {
  if(req.session.user_id){
    let id = req.session.user_id;
    app_modules.getUserById(id).then(val => {
      let templateVars = {
        user: {
          id:id,
          email:val[0].email
        }
      }
      res.render("urls_new",templateVars);
    })

  }else{
    res.redirect("/login")
  }
});

//The raute to show a single url
app.get("/urls/:id", (req, res) => {
  let id = req.session.user_id;
  let short_url = req.params.id;
  if(id){
   Promise.all([app_modules.getUserById(id), app_modules.getUrlByShort(id,short_url)]).then(vals => {
      let templateVars = {
        user: {
          id:id,
          email: vals[0][0].email
        },
       short_url:short_url,
       long_url:vals[1][0].long_url
      }
      res.render("urls_show", templateVars);
    })
  }else{
    res.redirect('/urls')
  }
});

//To handle post request from the "new" page to add to the database
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  longURL = fixUrl(longURL);
  let id = req.session.user_id;

  if(id){
    app_modules.insertUrl(shortURL,longURL,id).then(val =>
      res.redirect(longURL)
    );
  }else{
    res.redirect("/login");
  }
});

//To redirect the shorturl to longurl
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longUrl;
  res.redirect(longURL);
});

//To handle post request for deleting a url
app.post("/urls/:id/delete", (req, res) => {
  let short_url = req.params.id;
  let id = req.session.user_id;
  if(id){
    app_modules.deleteUrlByShortUrl(id,short_url).then(val => {
      res.redirect("/urls")
    })
  }else{
    res.redirect("/urls");
  }

});

//To handle the request from urls_show.ejs to update the url
app.post("/urls/update", (req, res) =>{
  let short_url = req.body.shortURL;
  let id = req.session.user_id;
  let long_url = req.body.longURL;
  long_url = fixUrl(long_url);
  if(req.session.user_id){
    app_modules.updateUrl(id,short_url,long_url).then(val => {
      res.redirect("/urls");
    })
  }else{
    re.redirect('/urls');
  }

});

app.post("/logout", (req, res) =>{
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if(req.body.email == "" || password == ""){
    res.status(400).send({ error: "Enter a valid email and a password" });
  }else{
    app_modules.getUserByEmail(email).then(val => {
      if(val.id){
        res.status(400).send({ error: "This email is already registered" });
      }else{
        app_modules.insertUser(email,password).then(value => {
          let id = value[0].id;
          req.session.user_id = id;
          user = {
            id: id,
            email: email
          };
          templateVars = user;
          res.redirect("/urls"),templateVars;
        });
      }
    })
  }
});

app.get("/login", (req, res) =>{
  if(req.session.user_id){
    res.redirect("/urls");
  }else{
    res.render("login");
  }
});

//To handle login and set the cookie
app.post("/login", (req, res) =>{
  let email = req.body.email;
  let password = req.body.password;
  let validation = 0;
  app_modules.getUserByEmail(email).then(val => {
    if(val[0]){
      if(bcrypt.compareSync(password,val[0].password)){
        validation =1;
        req.session.user_id = val[0].id;
        res.redirect("/urls");
      }
    }
    if(!validation){
      res.status(404).send({Error:"Either the email or password or both are incorrect"})
    }
  })
});







