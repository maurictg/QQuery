# HQuery
Small alternative for JQuery including AJAX

## Installation
Clone this repo and enter ```npm install```
To generate the hquery.min.js client-side file run ```npm run build```

## Usage
Simple usage example in a html file
```html
<html>
    <!DOCTYPE html>
    <head>
        <script src="hquery.min.js"></script>
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
The HQuery selector doesnt work the same as the JQuery selector. It has'nt any more functionality than ```document.querySelector```. The power of HQuery are the [functions](#Functions), [extensions](#Extensions) and [helpers](#Helpers).

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

## Functions
All available functions out-of-the-box with code samples

- [.each](#.each(callback)) Iterate over elements
- [.addClass](#.addClass(name)) Add classes
- [.rmClass](#.rmClass(name)) Remove classes

### .each(callback)
iterates over all selected elements
```js
$('#mydivs').each((element, index) => {
    console.log(`At index ${index} i found this HTML: ${$(element).html()}`);
})
```

### .addClass(name)
Add one or more classes to the selected elements
```js
$('#myel').addClass('bright');
$('#myel').addClass('black glass');
//Object { 0: p#myel.bright.black.glass, length: 1 }
```

### .rmClass(name)
Remove one or more classes from the selected elements
```js
//#myel has classes red, glass, shiny and bright

$('#myel').rmClass('red');
$('#myel').rmClass('shiny bright');
//Object { 0: p#myel.glass, length: 1 }
```



## Extensions

## Helpers