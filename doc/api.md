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
//     open: Workbook.open,
//     save: Workbook.save,
//     CONST: CONST,
//     utils: utils,
//     DomMixin: DomMixin,
//     Workbook: Workbook,
//     Sheet: Sheet,
//     Topic: Topic,
//     Relationship: Relationship,
//     Legend: Legend
// }
```

- [x] `xmind.open(filename)`

this method returns an Workbook instance, which can be considered as an xmind document.

```javascript
var workbook = xmind.open(filename);
```

- [x] `xmind.save(workbook, filename)`

save workbook(xmind document) to a file.

## CONST

all kinds of CONSTs, attribute names, tag names, other values, etc.

## utils

all kinds of helper functions

### properties

- [x] utils.getCurrentTimestamp()

- [x] utils.getDefaultSheetName(index)

- [x] utils.getDefaultTopicName(structureClass)

- [x] utils.findChildNode(doc, tagName, attrs)

- [x] utils.findChildNodes(doc, tagName, attrs)

- [x] utils.eachChildNode(doc, tagName, attrs, callback)

- [x] utils.findOrCreateChildNode(doc, tagName, attrs)

- [x] utils.removeChildNode(doc, tagName, attrs)

## DomMixin

all the constructors below is inherited from DomMixin. it provides some helper functions on Dom.

it requires all the sub-constructors instances to have a `doc` attribute. and the `doc` attribute must be an instance of [xmldom](https://github.com/jindw/xmldom) DocumentElement or Element.

### constructor properties

### instance properties

- [x] instance.getAttribute(name)

- [x] instance.setAttribute(name, value)

- [x] instance.removeAttribute(name)

- [x] instance.eachChildNode(tagName, attrs, callback)

- [x] instance.findOrCreateChildNode(tagName, attrs)

- [x] instance.getModifiedTime()

- [x] instance.setModifiedTime(timestamp/*Date instance or number(timestamp)*/)

- [x] instance.getTitle()

- [x] instance.setTitle(title)

- [x] instance.getPosition()

- [x] instance.setPosition(position)

- [x] instance.destroy()

- [x] instance.toPlainObject()

- [x] instance.toJSON()

`instance` can be:

* Workbook instance
* Sheet instance
* Topic instance
* Relationship instance
* Legend instance
* any other constructors with a `doc` property which is an xmldom Node instance.

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

### constructor properties

- [x] `Workbook.open(filename)`

- [x] `Workbook.save(workbook, filename)`

### instance properties

- [x] `workbook.getPrimarySheet()`

- [x] `workbook.addSheet(options)`

```javascript
options: {
    id: sheetId,
    title: sheetName,
    rootTopicId: rootTopicId,
    rootTopicName: rootTopicName,
    theme: theme,
}
```

- [x] `workbook.moveSheet(fromIndex, toIndex)`

- [x] `workbook.removeSheet(/* id or index or Sheet instance */)`

- [x] `workbook.save(filename)`

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

### constructor properties

### instance properties

- [x] `sheet.getTheme()`

- [x] `sheet.setTheme(theme)`

- [x] `sheet.getRootTopic()`

- [x] `sheet.addLegend()`

- [x] `sheet.removeLegend()`

- [x] `sheet.addMarkerDescription(markerId, description)`

- [x] `sheet.removeMarkerDescription(markerId)`

- [x] `sheet.addRelationship(options)`

```javascript
options: {
    id: id,
    sourceId: sourceId,
    targetId: targetId,
    title: title
}
```

- [x] `sheet.removeRelationship(relationship/*index, id, instance or sourceId, targetId*/)`

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

### constructor properties

- [x] `Topic.getTopic(topic/*index, id or instance*/, sheet)`

### instance properties

- [x] `topic.getBranch()`

- [x] `topic.setBranch(value)`

- [x] `topic.setBranchFolded()`

- [x] `topic.addChild(/*instance or options*/)`

- [x] `topic.removeChild(child/*id or instance*/, dryrun)`

- [x] `topic.moveTo(targetTopic)`

- [ ] `topic.moveChild(fromIndex, toIndex)`

- [x] `topic.getNotes()`

- [x] `topic.setNotes(notes)`

- [x] `topic.getLabels()`

- [x] `topic.setLabels(labels)`

- [x] `topic.getHyperlink()`

- [x] `topic.setHyperlink(hyperlink)`

- [x] `topic.removeHyperlink()`

- [x] `topic.getMarkers()`

- [x] `topic.setMarkers(markers)`

- [x] `topic.addMarker(id)`

- [x] `topic.removeMarker(id)`

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

### constructor properties

### instance properties

- [x] `relationship.getSource()`

- [x] `relationship.setSource(value)`

- [x] `relationship.getTarget()`

- [x] `relationship.setTarget(value)`

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

### constructor properties

- [x] `Legend.DEFAULT_VISIBILITY`
- [x] `Legend.DEFAULT_POSITION`

### instance properties

- [x] `legend.addMarkerDescription(markerId, description)`

- [x] `legend.removeMarkerDescription(markerId)`

- [x] `legend.getVisibility()`

- [x] `legend.setVisibility(value)`

## notes

* `instance.addXXXX()` and `instance.getXXXX()` usually returns the `XXXXX` added
* `instance.removeXXXX()`, `instance.setXXXX()`, etc. usually returns instance itself

[home](../README.md)

