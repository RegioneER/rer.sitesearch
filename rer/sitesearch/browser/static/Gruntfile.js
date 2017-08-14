module.exports = function (grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed',
      },
      dist: {
        files: {
          // 'destination': 'source'
          './sitesearch.css': './sitesearch.scss'
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions']
          })
        ]
      },
      dist: {
        src: './*.css'
      }
    },
    watch: {
      scripts: {
        files: [
          './*.scss'
        ],
        tasks: ['sass', 'postcss']
      }
    },
  });


  grunt.registerTask('compile', ['sass', 'postcss']);
  grunt.registerTask('default', ['watch']);
};
