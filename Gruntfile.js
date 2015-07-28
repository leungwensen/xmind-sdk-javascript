module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    var spawn = require( "child_process" ).spawn;

    grunt.registerTask('compileTemplates', function () {
        var done = this.async();
        spawn('node', [
            './bin/compileTemplate.js',
        ], {
            stdio: "inherit"
        }).on("close", function(code) {
            done(code === 0);
        });
    }); // compile templates

    grunt.loadNpmTasks('grunt-mocha-test'); // test

    require('load-grunt-config')(grunt, {
        init: true,
        data: {
            pkg: pkg,
            livereload: false,
        }
    });
};
