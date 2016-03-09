module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<notes><html>';helper.each(data.lines, function(line){ _s+='<xhtml:p>'+_e(line)+'</xhtml:p>';}); _s+='<!--styles are not supported yet {--><!--<xhtml:p>--><!--<xhtml:span style-id="67gllifq4r1g91gks0tdif9dou">what</xhtml:span>--><!--</xhtml:p>--><!--}--></html><plain>'+_e(data.plainNotes)+'</plain></notes>';return _s;
};