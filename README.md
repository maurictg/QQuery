# QQuery
Small alternative for JQuery including AJAX

## Installation
Clone this repo and enter ```npm install```
To generate the qquery.min.js client-side file run ```npm run build```.
Or download the qquery.min.js file from the Releases page in Github.

You can also install QQuery with NPM:
```
npm i @blocksharp/qquery
```

## Usage
To use QQuery in a html file download the qquery.min.js file from the releases page and import it in your HTML file like in the example below
```html
<html>
    <!DOCTYPE html>
    <head>
        <script src="qquery.min.js"></script>
    </head>
    <body>
        <p id="par">Hello</p>
        <input type="text" id="test" value="World!"/>
    </body>
    <script>
        console.log($('#par').text()+' '+$('test'). val())
    </script>
</html>
```

To use QQuery in your node project, they're two ways:
```js
import QQuery from '@maurictg/qquery';

//There two ways to get the $ selector
const $ = global.$; //You still need the import, else the global isnt set
const $ = QQuery.use();

//As you see, you can create multiple instances of QQuery in a node environment.
//Like if i want a Q as selector I just use:
const Q = QQuery.use();

Q('#myElement'); //This works!

function getHtmlElement() {
    return $('#myElement');
}

//Now we also have the globals.
console.log(global.QQuery.version);
console.log(global.$('#myElement'));
```

## Basics
### Selector
Use the selector to get a list of objects from the DOM. This uses _document.querySelector_ under the hood.

#### Example:
HTML:
```html
<div id="elements">
    <p id="henk">Henk</p>
    <p id="cleas">Cleas</p>
</div>
```
JS:
```js
    let el = $('#elements');
    console.log(el);

    //output:
    Object { 0: div#elements, length: 1 }
```

The selected DOM-elements are stored into the selector object. You can execute functions over this object which will return another list of DOM-elements or a value. There are also functions that will change the properties of the selected DOM-elements. Head over to [Functions](#Functions) to see which functions are available out-of-the-box.

**Using the raw elements in the selector**

You can use the DOM-elements in the selector to use vanilla javascript on them. Just use ```$('#yourselector')[index]``` to access an item in the selection. Use ```.length``` to see how much elements are present in the selection.

**Warning for JQuery users**
The QQuery selector doesnt work the same as the JQuery selector. It has'nt any more functionality than ```document.querySelector```. The power of QQuery are the [functions](#Functions), [extensions](#Extensions) and [helpers](#Helpers).

### Properties
The selector element has the following properties:
- **Q**: The query you used (like #elements)
- **length**: The amount of items selected
- **elements**. They are just primitive contents like in an array.

### Constructor
The selector's contructor accepts the following elements:
- string: Raw HTML, that will be converted to an DOM object list
- NodeList: Will be added to the selection
- HTMLCollection: Will be added to the selection
- A selector: will be cloned
- Array of HTMLElement: will be added to the selection
- HTMLElement: will be added to the selection
- function: This is a special one, it is a callback for when the document is loaded.

Some examples:
```js
$('<div id="henk">hello</div>')
//returns Object { 0: div#henk, length: 1 }

var el = document.querySelector('#test');
$(el)
//returns elements from el in selector object

//Special one: callback for html page loaded
$(() => {
    console.log('This is displayed when page is loaded!');
});
```

### The QQuery object
The QQuery object is used to [create extensions](#create-your-own-extension) and [helpers](#Helpers). It looks like this:
```js
QQuery = { 
    extensions: {…},
    version: "1.0",
    addHelper: addHelper(name, callback),
    setup: {
        ajax: {
            // see "Setup"
        }
    },
    use: use() //returns the $ selector
}
```
Head over to the helpers/extensions section to learn more over how to use the QQuery object. If you want to know how you use the setup, head over to [Setup](#Setup).

## Functions
All available functions out-of-the-box with code samples

_The functions below are fully chainable_

### .each(_callback_)
iterates over all selected elements
```js
$('#mydivs').each((element, index) => {
    console.log(`At index ${index} i found this HTML: ${$(element).html()}`);
})
```

### .addClass(_name_)
Add one or more classes to the selected elements
```js
$('#myel').addClass('bright');
$('#myel').addClass('black glass');
//Object { 0: p#myel.bright.black.glass, length: 1 }
```

### .rmClass(_name_)
Remove one or more classes from the selected elements
```js
//#myel has classes red, glass, shiny and bright

$('#myel').rmClass('red');
$('#myel').rmClass('shiny bright');
//Object { 0: p#myel.glass, length: 1 }
```

**Hide and show**
### .hide()
Hides one or more elements from the DOM with setting ```display: none```
```js
$('#myel').hide();
```

### .show()
Makes one or more hidden elements visible using ```display: block```
```js
$('#myel').show();
```

### .replace(_element_)
Replace one or more elements with another element
```js
// #1: existing element
$('#myel').replace($('#otherel'));

// #2: new element
let newEl = $('<h1>hey!</h1>').first();
$('#myel').replace(newEl);
```

**Event handlers**
### .on(_eventName_, _callback_)
Add event handler to one or more elements
```js
$('#mybutton').on('click', (event) => {
    console.log(event);
});
```

### .off()
Remove event handler(s) from one or more elements
```js
$('#mybutton').off();

//Can also be used to reset event handlers
$('#mybutton').off().on('click', ...);
```

**Parent and children nodes**

Html used in the examples below:
```html
<div id="parent">
    <div id="child"></div>
    <div id="secondChild"></div>
</div>
```

### .parent()
Return the parent node of the first element in the selection as a selector object
```js
    $('#child').parent();
    //Object { 0: div#parent, length: 1 }
```

### .children()
Return the children elements in a selection of the first element in the selector
```js
    $('#parent').children();
    //Object { 0: div#child, 1: div#secondChild, length: 2 }
```

**Smart selection**

QQuery offers a LINQ-like syntax for skipping, taking and getting elements in the selection.

The markup used in the examples below:
```html
<div id="threedivs">
    <div id="firstDiv">First</div>
    <div id="secondDiv">Second</div>
    <div id="thirdDiv">Third</div>
</div>
```

### .get(_index_)
Get specific element as a selector by the index in the selection. Zero-indexed.
```js
var threedivs = $('#threedivs').children();
var secondDiv = threedivs.get(1);
//Object { 0: div#secondDiv, length: 1 }

//To get the vanilla element you use:
$('#threedivs').children()[1];
```

### .first()
Returns first element in the selection as a selector
```js
$('#myelement').first();

//To get the raw element use
$('#myelement')[0];
```

### .skip(_number_)
Skips n elements in the selection and return the other ones
```js
var twoDivs = $('#threedivs').children().skip(1);
//Object { 0: div#secondDiv, 1: div#thirdDiv, length: 2 }
```

### .take(_number_)
Returns first n elements from the selection
```js
var firstTwoDivs = $('#threedivs').children().take(2);
//Object { 0: div#firstDiv, 1: div#secondDiv, length: 2 }
```

**Example of skip and take**

Markup
```html
<div class="fiveDivs" id="one">One</div>
<div class="fiveDivs" id="two">Two</div>
<div class="fiveDivs" id="three">Three</div>
<div class="fiveDivs" id="four">Four</div>
<div class="fiveDivs" id="five">Five</div>

<script>
    //Get div two, three and four
    let divs = $('.fiveDivs').skip(1).take(3);

    //Take div #tree
    let three = divs.skip(1).first(); //or: divs.get(1);
</script>
```

### .focus()
Set focus on the first element in selection
```js
$('#myelement').focus();
```

_The functions below are semi-chainable, because they're getters and setters. Only the setters are chainable_

### .html(_html?_)
Gets the innerHTML of the first element in the selection or sets the innerHTML to all elements in the selection
```js
//Get
var html = $('#myelement').html();

//Set
$('#myelement').html('<h1>Hey</h1>');
```

### .text(_text?_)
Gets the innerText of the first element in the selection or sets the innerText to all elements in the selection
```js
//Get
var text = $('#myelement').text();

//Set
$('#myelement').text('Hey');
```

### .val(_value?_)
Gets the value of the first element in the selection or sets the value to all elements in the selection
```js
//Get
var val = $('#myinput').val();

//Set
$('#myinput').val('Hey');
```

### .css(_propery, value?_)
Gets the value of the css propery from the first element in the selection or sets the value to a propery to all elements in the selection
```js
//Get
var color = $('#myelement').css('color');

//Set
$('#myelement').css('color', 'blue');
```

### .rmCss(_property_)
Remove a css propery from all elements in the selection
```js
$('#myelement').rmCss('background-color');
```

### .attr(_name, value?_)
Gets the value of an attribute from the first element in the selection or sets a value to all elements in the selection
```js
//Get
$('#myelement').attr('id'); //myelement

//Set
$('#myelement').attr('id', 'myelement');
```

### .rmAttr(_name_)
Remove an attribute from all elements in the selection
```js
$('#myelement').rmAttr('id');
```

### .prop(_name, value?_)
Get a propery value from an element or set a propery value to all elements in the selection
```js
//Get
$('#mycheckbox').prop('checked');

//Set
$('#mycheckbox').prop('checked', false);
```

### .data(_name, value?_)
Get the data-{name} value from the first element in the selection or sets the data-{name} attribute to all elements in the selection

Actually a shorthand for ```.attr('data-{name}')```

```js
//Get
$('#myelement').data('id');

//Set
$('#myelement').data('id', 5);
```

### .rmData(_name_)
Removes the data-{name} attribute from all elements in the selection
```js
$('#myelement').rmData('id');
```

**Special: append**

Append functions can be pretty difficult, use them with caution!
### .append(_element_)
Appends an element to the first element in the selection. You can also append HTML. This moves elements in your DOM.
```html
<div id="t">
    Hello!
</div>

<p id="t2">Test</p>
<script>
//Before append #t2 isn't a child of #t
$('#t').append($('#t2'));
//Now #t2 is a child of #t

//Append HTML to an element
$('#t').append('<h1>Hey!</h1>');
</script>
```

### .appendTo(_element_)
AppendTo is the inverse working of append. It appends the first element in the selection to another element. It accepts a selector anything you put into the selector, like a query string.
```html
<div id="t">
    Hello!
</div>

<p id="t2">Test</p>
<script>
//Before append #t2 isn't a child of #t
$('#t2').appendTo('#t');
//Now #t2 is a child of #t
//This also works: $('#t2').appendTo($('#t'));

//Append html to an element
$('<h1>hey</h1').appendTo('#t2');
</script>
```

### .appendBelow(_element_)
Append an element below the selected element. This function also supports HTML.
```html
<div id="parent">
    <p id="first"></p>
    <!-- second p should appear here -->
    <p id="third"></p>
</div>
<script>
$('#first').appendBelow('<p id="second"></p>');
</script>
```

### .appendAbove(_element_)
Append an element above the selected element. This function also supports HTML.
```html
<div id="parent">
    <p id="first"></p>
    <!-- secpnd p should appear here -->
    <p id="third"></p>
</div>
<script>
$('#third').appendAbove('<p id="second"></p>');
</script>
```

### .appendAt(_index, element_)
Append an element at a selected index in the selected element's children. This function also supports HTML.
```html
<div id="parent">
    <p id="first"></p> <!-- [0] => [0] -->
    <!-- second p should appear here -->
    <p id="third"></p> <!-- [1] => [2] -->
</div>
<script>
$('#parent').appendAt(1, '<p id="second"></p>');
</script>
```

_The functions below are not chainable_

### .destroy()
Destroys an element in the DOM.
```js
$('#myelement').destroy();
//Now myelement is gone forever.
```

### .toArray()
Returns array of all DOM objects in the selection
```js
$('.myelements').toArray();
```

### .clone()
Deeply clones the first HTML node in the selection
```js
let myel2 = $('#myelement').clone();
```

### .any()
Indicates if there are element in the selector.
To know how much, use the property .length
```js
if($('#myelement').any()) {
    console.log('MyElement exists!');
}
```

### .hasClass(_name_)
Indicates if an element contains a specified class
```js
$('#myel').addClass('bright');
$('#myel').hasClass('not-bright');
//this should return false
```

### .indexOf(_element_)
Find the index of an element in the children of the selected element
```html
<div id="parent">
    <p id="first"></p>  <!-- [0] -->
    <p id="second"></p> <!-- [1] -->
    <p id="third"></p>  <!-- [2] -->
</div>
<script>
    let second = $('#second');
    $('#parent').indexOf(second); // returns 1
</script>
```

### .indexInParent()
Returns the index of the selected element in its parent
```html
<div id="parent">
    <p id="first"></p>  <!-- [0] -->
    <p id="second"></p> <!-- [1] -->
    <p id="third"></p>  <!-- [2] -->
</div>
<script>
    $('#third').indexInParent(); // returns 2
</script>
```

## Extensions

QQuery offers some extensions out-of-the-box to make your life easier. You can also create [your own extension](#create-your-own-extension).

### .serialize(_json?_)
Serializes a form object to JSON or URL-encoded.
```html
<form id="myform">
    <input name="test" type="text" value="Hello"/>
    <input type="checkbox" name="isOkay" checked/>
    <input type="radio" name="gender"  value="male"/>
    <input type="radio" name="gender" value="female" checked/>
</form>

<script>
//To URL-encoded:
$('#myform').serialize(); //test=Hello&isOkay=on&gender=female
//When checkbox isnt checked, it will be emitted.
//Default value of checkbox is "ok", use the value= propery to set your own.

//To JSON:
$('#myform').serialize(true);
//Object { test: "Hello", isOkay: "on", gender: "female" }
</script>
```

### Create your own extension
QQuery allows you to create your own extension. Let us show you how! First of all, you have to know that the [QQuery object](#the-qquery-object) is used here.

To register an extension, you do the following:
```js
QQuery.extensions.yourExtension = (q, parameters) => {
    //q = The selector object
    //You can use other QQuery extensions/functions on q if you want, like .css and .html.
    
    if(parameters == 'Yes!') {
        q.css('color', 'green').html('Yes!');
    }
    
    //If you want to make your extension chainable, return q.
    return q;
};
```
On the place of "parameters" you can add as much as parameters as you want. The q parameter is the selector, make sure you include it even when you aren't using it.

You can call your extension like this:
```js
$('#myelement').yourExtension(parameters);
//Notice that q isn't available, q is passed by QQuery. It is just the $('#myelement') selector object.
```

If you are using NodeJS, you have to use the global extension setup like this:
```global.QQuery.extensions.myExtension = (q, ...)```

## Helpers
The following helpers are out-of-the-box. You can also [add your own helper](#create-your-own-helper).

### $.ajax(_options, callback_)

**XSRF**
All QQuery's XHR helpers automatically add the XSRF-token if ```<meta name="csrf-token">``` is present.

QQuery will add the X-CSRF-TOKEN header automatically for you from the CSRF-TOKEN cookie. If you want to configure this, head over to [Setup](#Setup).

Create a XHR request to a server.
The options parameter accepts the following object:
```js
Object {
    method, //string, "get", "post" etc.
    url, //string "/test/postTest" i.e.
    data, //object or string, opptional. like: {user: 'henk'} or URLEncoded 'user=henk'
    responseType, //required, sets the response format. When receiving JSON use 'json', xml/html use 'xml'. Text is default.
    requestType, //required in post/put, 'formencoded' or 'urlencoded' for 'application/x-www-form-urlencoded', 'json' for 'application/json'. If json, dont use string as data. Only usable by post/put.
    headers, //optional, add headers to the request. Object, {key: value, ...}
    onComplete, //optional, onComplete handler
    onError, //optional, onError handler
    onProgress(loaded, total, percentage), //optional, onProgress handler.
}
```
The callback parameter accepts a function like this:
```js
function callback(response, statusCode, statusText, responseHeaders)
```

Example:
```js
//Post formencoded data to a server
var options = {
    method: 'post',
    url: '/post',
    data: {
        username: 'henk',
        password: 'henk123'
    },
    requestType: 'formencoded',
    responseType: 'json'
};

$.ajax(options, (response, statusCode) => {
    if(statusCode === 200) {
        var json = response;
        //...
    }
});
```

### $.get(_url, callback, responseType = 'text'_)
Get data from a server. This is a helper for $.ajax
```js
$.get('/getdata', (r, status) => {
    if(status === 200) {
        console.log(r);
    }
}, 'json');
```

### $.post(_url, data, callback, resType = 'json', reqType = 'urlencoded'_)
Post data to the server. This is also a helper for $.ajax
```js
$.post('/postdata', {name: 'henk'}, (r, code) => {
    if(code === 201) {
        console.log(r);
    }
});
```

### $.put(_url, data, callback, resType = 'json', reqType = 'urlencoded'_)
PUT data to the server. This is also a helper for $.ajax
```js
$.put('/update', {id: 1, name: 'henk'}, (response, code) => {
    if(code === 200) {
        console.log(response);
    }
});
```

### $.del(_url, callback, resType = 'text'_)
Perform a DELETE HTTP request
```js
$.delete('/delete/1', (res, code) => {
    if(code === 204) {
        console.log(res);
    }
});
```

### $.getJSON(_url, callback_)
A shorthand for $.get
```js
$.getJSON('/getjson', (r) => {
    console.log(r);
});
```

### $.serializeJSON(_json_)
Serializes JSON to form/url encoded data
```js
var json = { name: 'henk', age: 20 };
var encoded = $.serializeJSON(json);
//name=henk&age=20
```

### $.deserializeJSON(_data_)
Deserializes form/url-encoded data string to JSON object.
```js
var str = 'name=henk&age=20';
var decoded = $.deserializeJSON(str);
//Object { name: 'henk', age: 20 };
```

### $.cookie(_name_)
Get cookie by name
```js
//document.cookie = 'name=henk';
var name = $.cookie('name'); // 'henk'
```

### Create your own helper
QQuery allows you to add your own helper using the QQuery object.

You can use the following function
```QQuery.addHelper(name, callback)```

Example:
```js
//Create a helper. For NodeJS use global.QQuery.addHelper(...)
QQuery.addHelper('test', (name) => {
    console.log('my name is: '+name);
});

//Usage:
$.test('henk');
//my name is: henk
```

## Setup

The QQuery setup object looks as follows:
```js
setup: {
    ajax: {
        type: 'header', //Type can be: header, cookie or form
        key: 'X-CSRF-TOKEN', //The name of the header, cookie or field

        //The value function returns the XSRF token from the page
        value: () => $('meta[name="csrf-token"]').attr('content'),
        //The hasValue method indicates if the token is present.
        hasValue: () => $('meta[name="csrf-token"]').any(),

        //The before callback is called before any AJAX request is sent
        before: () => {},
        //The after callback is called after any AJAX response is received. You can use this for a global error handler or sth like that
        after: (statusCode, response) => {}
    }
},
```

**Important note**

If you are using nodeJS, you have to use ```global.QQuery.setup``` instead of ```QQuery.setup``` to access the settings.

In a React application, you can do this using an useEffect hook.
```js
//QQuery setup
useEffect(() => {
    global.QQuery.setup.ajax.value = () => $.cookie('XSRF-TOKEN');
    global.QQuery.setup.ajax.hasValue = () => !!$.cookie('XSRF-TOKEN');
}, []);
```

By default, QQuery uses a X-CSRF-TOKEN header in every request. The token is obtained from the csrf-token meta-tag. This looks like this:
```html
<meta name="csrf-token" content="YOUR_CSRF_TOKEN">
```

Frameworks like Laravel automatically work without modifications if you are using this technique.

You can change the settings to whatever you want, but make sure the value and hasValue functions are correctly implemented.

Maybe it is still a bit unclear, watch the following 5 examples to understand how it works.

### Example 1: .NET Core MVC as header from cookie
Gets the XSFR token from a cookie and sends it as a X-CSFR-TOKEN header

C# startup.cs
```cs
//In ConfigureServices
services.AddAntiforgery(options => options.HeaderName = "X-CSRF-TOKEN");

//Configure
public void Configure(IApplicationBuilder app, IAntiforgery antiforgery)
{
    //...
    app.Use(async (context, next) =>
    {
        var tokens = antiforgery.GetAndStoreTokens(context);
            context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken,
                new CookieOptions() { HttpOnly = false });

        await next.Invoke();
    });

    //See https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-3.1#javascript-ajax-and-spas
}
```

Javascript
```js
//QQuery setup
$(() => {
    QQuery.setup.ajax.hasValue = () => !!$.cookie('XSRF-TOKEN');
    QQuery.setup.ajax.value = () => $.cookie('XSRF-TOKEN');
});

//Usage
$.post('/test', {name: 'henk'}, (r) => {
    //...
})
```

Like you see the QQuery.setup.ajax.type and key are omitted, because they equal the default values.

### Example 2: .NET Core MVC from form data without setup

HTML
```html
<form id="myform">
    @Html.AntiForgeryToken()
    <!-- renders <input name="__RequestVerificationToken" type="hidden" value="...">-->
    <input type="text" name="username" />
</form>
```
There is no setup needed, because QQuery doesnt need to add the token to the request.
```js
$(() => {
    $.post('/test', $('#myform').serialize(), (r) => {
        //...
    });
});
```

### Example 3: As formdata from cookie
Does something like Example 2, but uses the token from a cookie
Gets the XSRF token from a cookie and sends it as formdata.
```js
//Setup
$(() => {
    QQuery.setup.ajax.type = 'form';
    QQuery.setup.ajax.key = '__RequestVerificationToken';
    QQuery.setup.ajax.hasValue = () => !!$.cookie('XSRF-TOKEN');
    QQuery.setup.ajax.value = () => $.cookie('XSRF-TOKEN');
})
```

### Example 4: As cookie from meta tag
Gets the XSRF token from the meta tag and sends it as a cookie.
```js
//Setup
$(() => {
    QQuery.setup.ajax.type = 'cookie';
    QQuery.setup.ajax.key = 'XSFR-TOKEN'; //cookie name
    //hasValue and value can be omitted, the default csfr-token meta tag is used.
});
```

### Example 5: As header from meta tag
You have to do nothing, this is implemented by default.
But you can change the header name like this:
```js
$(() => {
    QQuery.setup.ajax.key = 'MY-TOKEN-NAME';
    //value and hasValue are default from meta tag
    //type is default 'header'
})
```
