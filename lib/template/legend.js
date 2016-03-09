module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<legend visibility="'+_e(data.visibility)+'"><marker-descriptions>';helper.each(data.markerDescriptions, function(md){ _s+='<marker-description description="'+_e(md.description)+'" marker-id="'+_e(md.id)+'"/>';}); _s+='</marker-descriptions><position svg:x="'+_e(data.position.x)+'" svg:y="'+_e(data.position.y)+'"/></legend>';return _s;
};