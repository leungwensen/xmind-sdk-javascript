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
    return (function(markers) {
        __p += '<marker-refs>';
        lang.each(markers, function(marker) {
            __p += '<marker-ref marker-id="' +
                ((__t = (marker)) == null ? '' : __t) +
                '"/>';
        });
        __p += '</marker-refs>\n\n';;
        return __p;
    })(data.markers);
};