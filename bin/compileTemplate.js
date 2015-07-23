#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    pastry = require('pastry'),
    utils = require('./utils.js'),
    prefix = 'lib/template/',
    RE_acceptSuffix = /\.(html|htm|ptmpl|xml)$/;

try {
    utils.walkFiles(prefix, function (file) {
        if (!RE_acceptSuffix.test(file)) { // 只接受 template 文件
            return;
        }
        var content = fs.readFileSync(file).toString(),
            outputFilename = file.replace(RE_acceptSuffix, function () { return '.js'; }),
            moduleStr = [
                'var helper = require("pastry");',
                'module.exports = %s;'
            ].join(' '),
            // bugfix for node.js version 0.12.0 {
            //     * new Function(){} => toString() :
            //         * additional line break;
            //         * additional `/**/`;
            // }
            resultStr = pastry.template.compile(content).toString()
                .replace(/function\s+anonymous\s*\([^){]*\)\s*\{/, 'function(obj, ne){')
                .replace(/\\n\s+/g, '')
                .replace(/\/\*\*\//g, '');

        console.log(file, outputFilename);

        fs.writeFileSync(
            outputFilename,
            pastry.sprintf(
                moduleStr,
                resultStr
            )
        );
    });
} catch(e) {
    console.log(e);
}
