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
    return (function(lines, plainNotes) {
        __p += '<notes><html>';
        lang.each(lines, function(line) {
            __p += '<xhtml:p>' +
                ((__t = (line)) == null ? '' : __t) +
                '</xhtml:p>';
        });
        __p += '<!--styles are not supported yet {--><!--<xhtml:p>--><!--<xhtml:span style-id="67gllifq4r1g91gks0tdif9dou">what</xhtml:span>--><!--</xhtml:p>--><!--}--></html><plain>' +
            ((__t = (plainNotes)) == null ? '' : __t) +
            '</plain></notes>\n';;
        return __p;
    })(data.lines, data.plainNotes);
};