var helper = require("pastry"); module.exports = function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<sheet id="'+_e(id)+'" timestamp="'+_e(timestamp)+'" ';if(theme) { _s+='theme="'+_e(theme)+'"';} _s+='><title>'+_e(title)+'</title></sheet>';}return _s;
};