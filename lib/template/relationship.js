module.exports = function anonymous(data,helper
/**/) {
data=data||{};helper=helper||{};var _e=helper.escape?helper.escape:function(s){return s;};var _s='<relationship end1="'+_e(data.sourceId)+'" end2="'+_e(data.targetId)+'" id="'+_e(data.id)+'"/>';return _s;
};