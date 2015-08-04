var helper = require("pastry"); module.exports = function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='';helper.each(labels, function(label){ _s+='<label>'+_e(label)+'</label>';}); _s+='';}return _s;
};