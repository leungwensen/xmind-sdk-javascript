/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.extend,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');

//var CONST = require('./CONST');
var utils = require('./utils');

var tmplTopic = require('./template/topic');

var Topic = declare('Topic', DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   // required {
         *      sheet
         *   // }
         *   // when creating a new one {
         *      [parent, ]title, structure, style (root topic has no parent)
         *   // }
         *   // when loading from an existing one {
         *      doc
         *   // }
         */
        var me = this,
            sheet = options.sheet;
        if (options.doc) {
            me.doc = options.doc;
            me._loadSubTopics();
        } else {
            me.doc = domParser.parseFromString(tmplTopic({
                id: uuid('topic-'),
                title: options.title,
                styleId: options.styleId,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
        }
        extend(me, {
            isRootTopic: !options.parent,
            id: me.getAttribute('id'),
            children: [],
        });
        sheet.topics.push(me);
        sheet.topicById[me.id] = me;
    },
    destroy: function() {
    },
    _loadSubTopics: function() {
        // TODO
    },
    // notes {
        getNotes: function() {
        },
        addNote: function() {
        },
        removeNote: function() {
        },
    // }
    // labels {
        getLabels: function() {
        },
        addLabel: function() {
        },
        removeLabel: function() {
        },
    // }
    // hyperlink {
        getHyperlink: function() {
        },
        setHyperlink: function() {
            /*
             * hyperlink which refers to one of these:
             *   - url
             *   - topic
             *   - file
             */
        },
    // }
    // marker {
        getMarkers: function() {
        },
        addMarker: function() {
        },
        removeMarker: function() {
        },
    // }
});

module.exports = Topic;
