Chattr-CodeDay
===============

An embedded website plugin allowing chats on any website (goal)

This was a project I worked on during my 24 hours of coding for CodeDay at Boston.

All that needs to be done is to include the script into your website and your good to go!

### User installation

1. Make this link a bookmark: [Chattr!](javascript:(function(){s=document.createElement('script');s.src='https://raw.githubusercontent.com/jplsek/Chattr-CodeDay/master/chattr.min.js';document.body.appendChild(s);})();) (Drag and drop the link into your bookmark bar.)

2. Click on the bookmark while on any website to open the chat session.

* Note: some websites don't allow execution of inline code (like github, however google works as a good test to see if it works).


### Warnings

* This was hacked together in less than 24 hours, most of which was a learning experience, as I rarely ever use Javascript (my code looks terrible).

* There are a LOT of bugs right now, as most of the features were rushed together in the last few hours of CodeDay.

### Current Features

* Able to chat to people, either anonymously or with a name

* Able to create and join chat (groups) rooms

* All shown and stored in real-time using the Firebase API (temporary)

* When Firebase is no longer a dependency, there will be no content restriction / content deletion.

### Features that NEED to be added

* Fix user lists.... (expect this to just not work.)

* Add removal of groups (automatic - based on inactivity, except the default group?)

* Remember last username used

* Remove firebase dependency, load stuf using ajax and from a database

* When a user joins / leaves, only show that information on that load (ie, not storing it in the database)

* Fix all the other bugs...

### Later?

* Passworded groups?

* When user says something twice, do something similar to facebook? (adds content to last li, instead of creating a new one)

* Upload files (click button to show pane of text when a file is uploaded?)

* Add total concurrent users?

* Rename this to something to more unique?

### Website Installation

1. Embed the minified js file to your header.

2. Change firebaseURL to your own firebase database (optional) / point to a custom database.

3. Done?

### Other

Development will be slow depending on demand.
