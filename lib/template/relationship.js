var helper = require("pastry"); module.exports = function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<relationship end1="'+_e(sourceId)+'" end2="'+_e(targetId)+'" id="'+_e(id)+'"/>';}return _s;
};