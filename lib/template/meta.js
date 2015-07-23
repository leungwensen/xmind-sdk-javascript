var helper = require("pastry"); module.exports = function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<?xml version="1.0" encoding="UTF-8" standalone="no"?><meta xmlns="urn:xmind:xmap:xmlns:meta:2.0" version="2.0"/>';}return _s;
};