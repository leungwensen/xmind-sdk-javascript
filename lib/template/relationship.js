/* eslint-disable */
const lang = require('zero-lang');
module.exports = function(data) {
    data = data || {};
    
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(sourceId, targetId, id) {
        __p += '<relationship end1="' +
            ((__t = (sourceId)) == null ? '' : __t) +
            '" end2="' +
            ((__t = (targetId)) == null ? '' : __t) +
            '" id="' +
            ((__t = (id)) == null ? '' : __t) +
            '"/>\n';;
        return __p;
    })(data.sourceId, data.targetId, data.id);
};