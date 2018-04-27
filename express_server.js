var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));



//This function generates a 6 character string
function generateRandomString() {
  var shortString = "";
  var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (shortString.length < 6) {
      shortString += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }
  return(shortString);
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//To show all the urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// To render the page for adding new urls
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//The raute to show a single url
app.post("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

//To handle post request from the "new" page to add to the database
app.post("/urls", (req, res) => {
   let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  var longRes = longURL.substr(0, 11);
  var shortRes = longURL.substr(0,4);
  if(longRes === "http://www."){
  }else if(shortRes === "www."){
    longURL= "http://" + longURL;
  }else{
    longURL = "http://www." + longURL
  }
  urlDatabase[shortURL] = longURL;
  res.redirect(longURL);
});

//To redirect the shorturl to longurl
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//To handle post request for deleting a url
app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});




