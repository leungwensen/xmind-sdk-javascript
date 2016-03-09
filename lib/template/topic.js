module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<topic id="'+_e(data.id)+'" ';if(data.styleId) { _s+='style-id="'+_e(data.styleId)+'"';} _s+='><title>'+_e(data.title)+'</title></topic>';return _s;
};