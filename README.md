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
* [bruce/node-temp](https://github.com/bruce/node-temp.git)
* [jindw/xmldom](https://github.com/jindw/xmldom.git)

and these projects helps a lot, too:

* [xmindltd/xmind-sdk-python](https://github.com/xmindltd/xmind-sdk-python.git)
* [xmindltd/xmind](https://github.com/xmindltd/xmind.git)
* [Mekk/mekk.xmind](https://bitbucket.org/Mekk/mekk.xmind)

## History

#### 0.0.20150728

* xmind.save
* more APIs
* more test cases
* API reference documentation

#### 0.0.20150728

* xmind.open
* basic test cases
* release on npmjs.org for the first time

## License (MIT License)

The MIT License (MIT)

Copyright (c) 2015 leungwensen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

