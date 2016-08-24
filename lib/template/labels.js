const lang = require('zero-lang');
module.exports = function(data) {
    data = data || {};
    
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(labels) {
        __p += '<labels>';
        lang.each(labels, function(label) {
            __p += '<label>' +
                ((__t = (label)) == null ? '' : __t) +
                '</label>';
        });
        __p += '</labels>\n';;
        return __p;
    })(data.labels);
};