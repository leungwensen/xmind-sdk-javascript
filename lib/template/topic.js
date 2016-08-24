const lang = require('zero-lang');
module.exports = function(data) {
    data = data || {};
    
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(id, styleId, title) {
        __p += '<topic id="' +
            ((__t = (id)) == null ? '' : __t) +
            '" ';
        if (styleId) {
            __p += 'style-id="' +
                ((__t = (styleId)) == null ? '' : __t) +
                '"';
        }
        __p += '><title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title></topic>\n';;
        return __p;
    })(data.id, data.styleId, data.title);
};