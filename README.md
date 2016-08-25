xmind-sdk-javascript
====================

XMind SDK for javascript (IN BOTH NODE.JS & BROWSERS)

## Usage (see [API reference](doc/api.md) for more information)

```shell
npm install xmind
```

```javascript
var xmind = require('xmind'),
    Workbook = xmind.Workbook;

// open xmind file
var workbookFromFile = xmind.open('path/to/xmind-file.xmind');

// creating a new xmind file
var workbook = new Workbook({
    firstSheetId: 'sheet-1',
    firstSheetName: 'primary sheet',
    rootTopicId: 'topic-1',
    rootTopicName: 'root topic'
});

// saving an xmind file
workbook.save('path/to/new-xmind-file.xmind');
// or
xmind.save(workbook, 'path/to/new-xmind-file.xmind');

// output as JSON String
workbook.toJSON();

// get the primary sheet
var sheet = workbook.getPrimarySheet();
// add a new sheet
var newSheet = workbook.addSheet(/*options*/);

// get the root topic
var rootTopic = sheet.rootTopic;

// add a subtopic
var subTopic = rootTopic.addChild(/*options*/);
```

## [API reference](doc/api.md)

## Thanks to

xmind-sdk-javascript is built on top of all these fantastic projects:

* [Stuk/jszip](https://github.com/Stuk/jszip.git)
* [eligrey/FileSaver.js](https://github.com/eligrey/FileSaver.js.git)
* [jindw/xmldom](https://github.com/jindw/xmldom.git)

and these projects helps a lot, too:

* [xmindltd/xmind-sdk-python](https://github.com/xmindltd/xmind-sdk-python.git)
* [xmindltd/xmind](https://github.com/xmindltd/xmind.git)
* [Mekk/mekk.xmind](https://bitbucket.org/Mekk/mekk.xmind)

## [History](doc/history.md)

## [License (MIT License)](doc/license.md)

