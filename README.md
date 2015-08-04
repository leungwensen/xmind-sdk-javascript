# xmind-sdk-node

XMind SDK for Node.js

## Usage

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
    firstSheetName: 'primary sheet',
    rootTopicName: 'root topic'
});

// saving an xmind file {
    workbook.save('path/to/new-xmind-file.xmind');
    // or
    xmind.save(workbook, 'path/to/new-xmind-file.xmind');
// }
```

## [API reference](doc/api.md)

## Thanks to

xmind-sdk-node is built on top of all these fantastic projects:

* [Stuk/jszip](https://github.com/Stuk/jszip.git)
* [jindw/xmldom](https://github.com/jindw/xmldom.git)

and these projects helps a lot, too:

* [xmindltd/xmind-sdk-python](https://github.com/xmindltd/xmind-sdk-python.git)
* [xmindltd/xmind](https://github.com/xmindltd/xmind.git)
* [Mekk/mekk.xmind](https://bitbucket.org/Mekk/mekk.xmind)

## [History](doc/history.md)

## [License (MIT License)](doc/license.md)

