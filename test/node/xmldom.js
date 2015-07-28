var xmldom = require('xmldom');
var DOMParser = xmldom.DOMParser;
var XMLSerializer = xmldom.XMLSerializer;

var template = [
    '<xml xmlns="1" xmlns:a="2" a:test="3">',
        '<title>',
            //'hello',
        '</title>',
    '</xml>'
].join('');

var doc = new DOMParser().parseFromString(template);
var docStr = new XMLSerializer().serializeToString(doc);

