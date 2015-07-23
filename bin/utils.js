/* jshint strict: true, undef: true, unused: true, node: true */
// /* global */

'use strict';
/*
 * @author      : 绝云
 * @description : utils
 */

var fs = require('fs'),
    pastry = require('pastry');

function walkFiles (path, processFile) {
    var dirList = fs.readdirSync(path),
        file;

    pastry.each(dirList, function(item){
        file = pastry.sprintf('%s/%s', path, item);

        if (fs.statSync(file).isFile()){
            processFile(file);
        } else if (fs.statSync(file).isDirectory()){
            walkFiles(file, processFile);
        }
    });
}

module.exports = {
    walkFiles : walkFiles
};
