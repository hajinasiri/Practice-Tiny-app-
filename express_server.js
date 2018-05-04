var express = require("express");
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
var cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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

//This function set returns the approperiate user by looking at the cookie
function setTheUser(reqCookies){
  let user ={};
  if(reqCookies["user_id"]){
    let user_id = reqCookies["user_id"];
    if(user_id in users){
      user = users[user_id];
    }
  }
  return(user);
}

function urlsForUserId(id){
  let ufu = {};
  let shorts = Object.keys(urlDatabase);
  shorts.forEach(function(short){
    if(urlDatabase[short].userID === id){
      ufu[short] = urlDatabase[short];
    }
  });
  return ufu
}

var urlDatabase = {
  "b2xVn2": {longUrl: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longUrl: "http://www.google.com", userID: "user2RandomID"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//To show all the urls
app.get("/urls", (req, res) => {
  let user = setTheUser(req.cookies);
  let ufu = urlsForUserId(req.cookies["user_id"]);
  let templateVars = { user:user, urls: ufu };
  res.render("urls_index", templateVars);
});

// To render the page for adding new urls
app.get("/urls/new", (req, res) => {
  if(req.cookies["user_id"]){
    let user = users[req.cookies["user_id"]];
    templateVars ={user:user};
    res.render("urls_new",templateVars);
  }else{
    res.redirect("/login")
  }
});

//The raute to show a single url
app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let user = setTheUser(req.cookies);
  let templateVars = { user:user, "shortURL": req.params.id, "longURL":urlDatabase[shortURL].longUrl};
  res.render("urls_show", templateVars);
});

//To handle post request from the "new" page to add to the database
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let longRes = longURL.substr(0, 11);
  let shortRes = longURL.substr(0,4);
  let user_id = req.cookies["user_id"];
  if(longRes === "http://www."){
  }else if(shortRes === "www."){
    longURL= "http://" + longURL;
  }else{
    longURL = "http://www." + longURL
  }
  if(req.cookies["user_id"]){
    let user_id = req.cookies["user_id"];
    urlDatabase[shortURL] = {longUrl:longURL, userID:user_id};
    res.redirect(longURL);
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
  let shortURL = req.params.id;
  if(req.cookies["user_id"]){
    let user_id = req.cookies["user_id"];
    if(user_id in users && urlDatabase[shortURL].userID === user_id){
      delete urlDatabase[shortURL];
    }
  }
  res.redirect("/urls");
});

//To handle the request from urls_show.ejs to update the url
app.post("/urls/update", (req, res) =>{
  let shortURL = req.body.shortURL;
  if(req.cookies["user_id"]){
    if(req.cookies["user_id"] === urlDatabase[shortURL].userID){
      urlDatabase[shortURL].longUrl = req.body.longURL;
    }
  }
  res.redirect("/urls");
});

app.post("/logout", (req, res) =>{
  res.clearCookie('user_id');
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
    let user_id = generateRandomString();
    let password = bcrypt.hashSync(req.body.password, 10);
    user = {
      id: user_id,
      email: email,
      password: password
    };
    users[user_id] = user;
    res.cookie('user_id',user_id, { maxAge: 900000, httpOnly: true });
    templateVars = user;
    res.redirect("/urls"),templateVars;
  }
});

app.get("/login", (req, res) =>{
  if(req.cookies["user_id"]){
    res.redirect("/urls");
  }else{
    res.render("login");
  }
});

//To handle login and set the cookie
app.post("/login", (req, res) =>{
  let userKeys = Object.keys(users);
  let emailValidation = 0;
  let passwordValidation = 0;
  let password = req.body.password;
  userKeys.forEach(function(key){
    if(users[key].email === req.body.email){
      emailValidation = 1;
      if(bcrypt.compareSync(password,users[key].password)){
        passwordValidation = 1;
        res.cookie('user_id',users[key].id, { maxAge: 900000, httpOnly: true });
        res.redirect("/urls");
      }
    }
  });
  if(emailValidation === 0 || passwordValidation === 0){
    res.status(404).send({Error:"Either the email or password or both are not correct"})
  }

});







