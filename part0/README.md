# [Fundamentals of Web apps Exercises 0.1.-0.6.](https://fullstackopen.com/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6)

## 0.1: HTML

Review the basics of HTML by reading this tutorial from Mozilla: [HTML tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)

## 0.2: CSS

Review the basics of CSS by reading this tutorial from Mozilla: [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)

## 0.3: HTML forms

Learn about the basics of HTML forms by reading Mozilla's tutorial: [Your first form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form)

## 0.4: new note

Create a diagram depicting the situation where the user creates a new note on page https://fullstack-exampleapp.herokuapp.com/notes by writing something into the text field and clicking the submit button.

All necessary information for doing this, and the next two exercises, can be found from the text of [this part](https://fullstackopen.com/en/part0/fundamentals_of_web_apps#forms-and-http-post). The idea of these exercises is to read the text through once more, and to think through what is going on where.

### Solution

![New note](0.4 new note.png)

By https://www.websequencediagrams.com/

```
title 0.4: new note

note over browser:
User creates a new note,
user writes something into the text field,
user clicks the submit button.
After the button on the form is clicked, 
the browser will send the user input to the server. 
end note

browser->server: HTTP POST https://fullstack-exampleapp.herokuapp.com/new_note

note over server:
The server responds with HTTP status code 302.
This is a URL redirect,
with which the server asks the browser to do a
new HTTP GET request to the address defined
in the header's Location - the address notes.
end note

server-->browser: responds with HTTP status code 302

note over browser:
So, the browser reloads the Notes page.
The reload causes three more HTTP requests:
1. fetching the style sheet (main.css), 
2. the JavaScript code (main.js),
3. the raw data of the notes (data.json). 
end note

browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/notes
server-->browser: HTML-code
browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/main.css
server-->browser: main.css
browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/main.js
server-->browser: main.js

note over browser:
browser starts executing js-code
that requests JSON data from server
end note

browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/data.json
server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

note over browser:
browser executes the event handler
that renders notes to display
end note
```

## 0.5: Single page app

Create a diagram depicting the situation where the user goes to the single page app version of the notes app at https://fullstack-exampleapp.herokuapp.com/spa.

### Solution

![Single page app](0.5 Single page app)

```
title 0.5: Single page app

browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/spa
server-->browser: HTML-code
browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/main.css
server-->browser: main.css
browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/spa.js
server-->browser: spa.js

note over browser:
browser starts executing js-code
that requests JSON data from server
end note

browser->server: HTTP GET https://fullstack-exampleapp.herokuapp.com/data.json
server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

note over browser:
browser executes the event handler
that renders notes to display
end note
```


## 0.6: New note

Create a diagram depicting the situation where user creates a new note using the single page version of the app.

### Solution

![New note](0.6 New note.png)

```
title 0.6: New note

note over browser:
User writes something into the text field,
user clicks the submit button.
After the button on the form is clicked, 
the browser will send the user input to the server. 
end note

browser->server: HTTP POST https://fullstack-exampleapp.herokuapp.com/new_note_spa

note over server:
The server responds with status code 201 created.
This time the server does not ask for a redirect,
the browser stays on the same page,
and it sends no further HTTP requests. 
end note

server-->browser: responds with HTTP status code 201

note over browser:
So, the browser NO reloads the Notes page.
end note

note over browser:
browser executes the event handler
that renders notes to display
end note
```

