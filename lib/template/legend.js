const lang = require('zero-lang');
module.exports = function(data) {
    data = data || {};
    
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(visibility, markerDescriptions, position) {
        __p += '<legend visibility="' +
            ((__t = (visibility)) == null ? '' : __t) +
            '" xmlns:svg="http://www.w3.org/2000/svg"><marker-descriptions>';
        lang.each(markerDescriptions, function(md) {
            __p += '<marker-description description="' +
                ((__t = (md.description)) == null ? '' : __t) +
                '" marker-id="' +
                ((__t = (md.id)) == null ? '' : __t) +
                '"/>';
        });
        __p += '</marker-descriptions><position svg:x="' +
            ((__t = (position.x)) == null ? '' : __t) +
            '" svg:y="' +
            ((__t = (position.y)) == null ? '' : __t) +
            '"/></legend>\n';;
        return __p;
    })(data.visibility, data.markerDescriptions, data.position);
};