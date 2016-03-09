module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<sheet id="'+_e(data.id)+'" ';if(data.theme) { _s+='theme="'+_e(data.theme)+'"';} _s+='><title>'+_e(data.title)+'</title></sheet>';return _s;
};