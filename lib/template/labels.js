module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<labels>';helper.each(data.labels, function(label){ _s+='<label>'+_e(label)+'</label>';}); _s+='</labels>';return _s;
};