# xmind-sdk-node

XMind SDK for Node.js

## Usage

```shell
npm install xmind
```

```javascript
var xmind = require('xmind'),
    Workbook = xmind.Workbook;

// creating Workbook instance {
    var workbookFromFile = xmind.open('path/to/xmind-file.xmind');

    var workbook = new Workbook({
        firstSheetName: 'sheet name',
        rootTopicName: 'topic name'
    });
// }

// sheets {
    workbook.addSheet(/*sheetName, rootTopicName, theme*/);
    workbook.moveSheet(/*fromIndex, toIndex*/);
    workbook.removeSheet(/*index|id|instance of Sheet*/);
    var sheet = workbook.getPrimarySheet();
// }

// topics {
    sheet.addRootTopic(/*topicName*/);
    sheet.removeRootTopic(/*index|id|instance of Topic*/);
    war rootTopic = sheet.getPrimaryRootTopic();
    /*
     * TODO
     *   - sub topics
     *   - notes
     *   - markers
     *   - labels
     *   - hyperlinks
     *   - etc.
     */
// }

// methods shared by Workbook, Sheet, Topic, Relation, etc. {
    // attributes
    // childNodes
    // updated time
    // title
    // position
// }

// saving Workbook instance into a file {
    workbook2.save('path/to/new-xmind-file.xmind');
// }
```
## Thanks to

* [Stuk/jszip](https://github.com/Stuk/jszip)
* [bruce/node-temp](https://github.com/bruce/node-temp)
* [jindw/xmldom](https://github.com/jindw/xmldom)
* [substack/node-optimist](https://github.com/substack/node-optimist)

## History

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

