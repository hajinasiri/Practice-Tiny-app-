# Tiny-app-

TinyApp is a full stack web application that lets the users register and get a short url for any url they give the app.
This app is built with Node, Express, and used PostgreSQL database language.

# Dependencies
- Node
- Express
- Cookie parser
- knex
- Cookie session
- bcrypt
- body parser

# Running the app
- You need to install the dependencies and have ProgreSQL installed on your system.
- create a database named tiny_app. 
- Clone this repository and from your terminal go inside the folder you cloned. 
- Inside Settings.js file change the user and password to the user and password your progreSQL recognizes.
- From your terminal run "knex migrate:latest". This creates the needed tables in your database.
- From your terminal run "node knex_express_server.js"

# ScreenShots
- The first page user sees. There are login and registration options 
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.40.44%20PM.png?raw=true)

- Registration page 
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.41.10%20PM.png?raw=true)

- Login page 
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.40.54%20PM.png?raw=true)

- After user logs in, his page is blank and he can click on the link and start adding new url 
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.41.43%20PM.png?raw=true)

- In this page user can enter a new url to get a shorturl 
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.41.50%20PM.png?raw=true)

- When the user adds a new url, the url and its shortcut show up on his page. Then he can delet it by clicking on Delete button or edit it by clicking on Edit link
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.42.08%20PM.png?raw=true)

- In Edit page, user can edit the url he wanted to edit.
!["The chatty app page"](https://github.com/hajinasiri/Practice-Tiny-app-/blob/master/Doc/Screen%20Shot%202018-06-20%20at%204.42.18%20PM.png?raw=true)
