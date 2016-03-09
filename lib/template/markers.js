module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<marker-refs>';helper.each(data.markers, function(marker){ _s+='<marker-ref marker-id="'+_e(marker)+'"/>';}); _s+='</marker-refs>';return _s;
};