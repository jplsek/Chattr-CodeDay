Chattr-CodeDay
===============

An embedded website plugin allowing chats on any website (goal)

This was a project I worked on during my 24 hours of coding for CodeDay at Boston.

All that needs to be done is to include the script into your website and your good to go!

### Warnings

* This was hacked together in less than 24 hours, most of which was a learning experience, as I rarely ever use Javascript (my code looks terrible).

* There are a lot of bugs right now, as most of the features were rushed together in the last few hours of CodeDay.

* Bugs: Users sometimes don't get removed when disconnecting, user list gets messy when changing groups/ just doesn't work how it should.

### Features that NEED to be added

* Upload files (click button to show pane of text when a file is uploaded?)

* Fix user lists....

* Add total concurrent users

* Add removal of groups (automatic - based on inactivity, except the default group?)

* Passworded groups?

* Remember last username used

* Remove firebase dependency, load stuf using ajax and from a database

* When user says something twice, do something similar to facebook? (adds content to last li, instead of creating a new one)

* When a user joins / leaves, only show that information on that load (ie, not storing it in the database)

* Fix all the other bugs...

### Current Features

* Able to chat to people, either anonymously or with a name

* Able to create and join chat (groups) rooms

* All shown and stored in real-time using the Firebase API (temporary)

### Installation

1. Embed the js files to your header (eventually only one file)

2. Change firebaseURL to your own firebase database (optional)

3. Done?

### Other

Development will be slow depending on demand.
