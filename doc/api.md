# `xmind-sdk-node` manual & documentation

## NOTICE

the checked ones are APIs that are supported by the current version.

the unchecked ones are under develpment.

## installation

```shell
npm install xmind
```

## xmind

```javascript
var xmind = require('xmind');

// `xmind` here is an object:
// {
//     DomMixin: DomMixin,
//     Legend: Legend,
//     Relationship: Relationship,
//     Sheet: Sheet,
//     Topic: Topic,
//     Workbook: Workbook,
//     open: Workbook.open,
//     save: Workbook.save
// }
```

- [x] `xmind.open(filename)`

this method returns an Workbook instance, which can be considered as an xmind document.

```javascript
var workbook = xmind.open(filename);
```

- [x] `xmind.save(workbook, filename)`

save workbook(xmind document) to a file.

## DomMixin

all the constructors below is inherited from DomMixin. it provides some helper methods on Dom.

it requires all the sub-constructors instances to have a `doc` attribute. and the `doc` attribute must be an instance of [xmldom](https://github.com/jindw/xmldom) DocumentElement or Element.

### constructor methods

### instance methods

- [x] instance.getAttribute(name)
- [x] instance.setAttribute(name, value)
- [x] instance.removeAttribute(name)
- [x] instance.eachChildNode(callback)
- [x] instance.findOrCreateChildNode(tagName, attrs)
- [x] instance.getModifiedTime()
- [x] instance.setModifiedTime(timestamp)
- [ ] instance.getTitle()
- [ ] instance.setTitle(title)
- [ ] instance.getPosition()
- [ ] instance.setPosition(position)

`instance` can be:

* Workbook instance
* Sheet instance
* Topic instance
* Relationship instance
* Legend instance

## Workbook

### creating an instance

```javascript
var Workbook = xmind.Workbook;
var workbook = new xmind.Workbook({
    /*
     * options:
     *   // when creating a new one {
     *      - firstSheetName
     *      - rootTopicName
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *      - stylesDoc
     *      - attachments
     *   // }
     */
});
```

### constructor methods

- [x] `Workbook.open(filename)`
- [x] `Workbook.save(workbook, filename)`

### instance methods

- [x] `workbook.save(filename)`
- [x] `workbook.getPrimarySheet()`
- [x] `workbook.addSheet(sheetName, rootTopicName, theme)`
- [x] `workbook.moveSheet(fromIndex, toIndex)`
- [x] `workbook.removeSheet(/* id or index 0r Sheet instance */)`
- [x] `workbook.save(filename)`
- [ ] `workbook.toPlainObject()`
- [ ] `workbook.toJSON()`

## Sheet

### creating an instance

```javascript
var Sheet = xmind.Sheet;
var sheet = new Sheet({
    /*
     * options:
     *   - workbook(required)
     *   // when creating a new one {
     *      - title
     *      - rootTopicName
     *      - theme
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
});
```

### constructor methods

### instance methods

- [x] `sheet.getPrimaryRootTopic()`
- [x] `sheet.addRootTopic(topicName)`
- [x] `sheet.removeRootTopic(/* id or Topic instance */)`
- [ ] `sheet.addLegend()`
- [ ] `sheet.addRelationship()`
- [ ] `sheet.toPlainObject()`
- [ ] `sheet.toJSON()`
- [ ] `sheet.destroy()`

## Topic

### creating an instance

```javascript
var Topic = xmind.Topic;
var topic = new Topic({
    /*
     * options:
     *   - sheet(required)
     *   - parent
     *   - type
     *   // when creating a new one {
     *      - title
     *      - structure
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
});
```

### constructor methods

### instance methods

- [ ] `topic.getNotes()`
- [ ] `topic.addNote()`
- [ ] `topic.removeNote()`
- [ ] `topic.getLabels()`
- [ ] `topic.addLabel()`
- [ ] `topic.removeLabel()`
- [ ] `topic.getHyperlink()`
- [ ] `topic.setHyperlink()`
- [ ] `topic.removeHyperlink()`
- [ ] `topic.getMarkers()`
- [ ] `topic.addMarker()`
- [ ] `topic.removeMarker()`
- [ ] `topic.toPlainObject()`
- [ ] `topic.toJSON()`
- [ ] `topic.destroy()`

## Relationship

### creating an instance

```javascript
var Relationship = xmind.Relationship;
var relationship = new Relationship({
    /*
     * options:
     *   - sheet(required)
     *   // when creating a new one {
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
});
```

### constructor methods

### instance methods

## Legend

### creating an instance

```javascript
var Legend = xmind.Legend;
var legend = new Legend({
    /*
     * options:
     *   - sheet(required)
     *   // when creating a new one {
     *      - title
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
});
```

### constructor methods

### instance methods


[home](../README.md)
