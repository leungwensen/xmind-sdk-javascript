module.exports = function (grunt) {
    'use strict';

    var spawn = require( "child_process" ).spawn,
        pkg   = grunt.file.readJSON('package.json');

    grunt.registerTask('compileTemplates', function () {
        var done = this.async();
        spawn('node', [
            './bin/compileTemplate.js',
        ], {
            stdio: "inherit"
        }).on("close", function(code) {
            done(code === 0);
        });
    });

    require('load-grunt-config')(grunt, {
        init: true,
        data: {
            pkg: pkg,
            livereload: false,
        }
    });
};
