const lang = require('zero-lang');
module.exports = function(data) {
    data = data || {};
    
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function() {
        __p += '<?xml version="1.0" encoding="UTF-8" standalone="no"?><xmap-styles xmlns="urn:xmind:xmap:xmlns:style:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" version="2.0"><automatic-styles></automatic-styles><master-styles></master-styles><styles></styles></xmap-styles>\n';;
        return __p;
    })();
};