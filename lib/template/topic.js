var helper = require("pastry"); module.exports = function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<topic id="'+_e(id)+'" ';if(styleId) { _s+='style-id="'+_e(styleId)+'"';} _s+=' timestamp="'+_e(timestamp)+'"><title>'+_e(title)+'</title></topic>';}return _s;
};