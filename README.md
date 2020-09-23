# QQuery
Small alternative for JQuery including AJAX

## Installation
Clone this repo and enter ```npm install```
To generate the qquery.min.js client-side file run ```npm run build```

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
import { $ } from 'qquery';

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
The Hquery object is used to [create extensions](#create-your-own-extension) and [helpers](#Helpers). It looks like this:
```js
QQuery = { 
    extensions: {…},
    version: "1.0",
    addHelper: addHelper(name, callback) 
}
```
Head over to the helpers/extensions section to learn more over how to use the QQuery object.

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
$('#myelement').attr('id')l //myelement

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

Append functions are pretty difficult, use them with caution!
### .append(element)
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

### .appendTo(element)
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
QQuery allows you to create your own extension. Let us show you how! First of all, you have to know that the [QQuery object](#'the-qquery-object') is used here.

To register an extension, you do the following:
```js
QQuery.extensions.yourExtension = (q, parameters) => {
    var selector = q; 
    //q = The selector object
    //You can use other QQuery extensions/functions on h if you want, like .css and .html.
    
    if(parameters == 'Yes!') {
        q.css('color', 'green').html('Yes!');
    }
    
    //If you want to make your extension chainable, return q.
    return q;
};
```
On the place of "parameters" you can add as much as parameters as you want. The q parameter is the selector, make sure you include it even when you are'nt using it.

You can call your extension like this:
```js
$('#myelement').yourExtension(parameters);
//Notice that q isn't available, q is passed by QQuery. It is just the $('#myelement') selector object.
```

If you are using NodeJS, you have to use the global like this:
```global.QQuery.extensions.myExtension = (q, ...)```

## Helpers
[documentation in progress]

Helpers out-of-the-box:

$.post, $.get, $.ajax, $.getJSON, $.serializeJSON