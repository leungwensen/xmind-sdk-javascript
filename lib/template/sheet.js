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
    return (function(id, theme, title) {
        __p += '<sheet id="' +
            ((__t = (id)) == null ? '' : __t) +
            '" ';
        if (theme) {
            __p += 'theme="' +
                ((__t = (theme)) == null ? '' : __t) +
                '"';
        }
        __p += '><title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title></sheet>\n';;
        return __p;
    })(data.id, data.theme, data.title);
};