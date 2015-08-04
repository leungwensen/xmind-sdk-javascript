var helper = require("pastry"); module.exports = function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='';helper.each(markers, function(marker){ _s+='<marker-ref marker-id="'+_e(marker)+'"/>';}); _s+='';}return _s;
};