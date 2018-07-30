module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  var productRoot = 'rer/sitesearch/browser/static';
  grunt.initConfig({
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed',
      },
      dist: {
        files: {
          // 'destination': 'source'
          './rer/sitesearch/browser/static/sitesearch.css':
            './rer/sitesearch/browser/static/sitesearch.scss',
        },
      },
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions'],
          }),
        ],
      },
      dist: {
        src: './rer/sitesearch/browser/static/*.css',
      },
    },
    cssmin: {
      target: {
        files: {
          './rer/sitesearch/browser/static/build/sitesearch.min.css': [
            `${productRoot}/sitesearch.css`,
            `${productRoot}/bootrap-nav.min.css`,
          ],
        },
      },
      options: {
        sourceMap: true,
      },
    },
    requirejs: {
      sitesearch: {
        options: {
          baseUrl: './',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          paths: {
            jquery: 'empty:',
          },
          wrapShim: true,
          name: `${productRoot}/sitesearch.js`,
          exclude: ['jquery'],
          out: `${productRoot}/build/sitesearch-compiled.js`,
          optimize: 'none',
        },
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['env'],
      },
      dist: {
        files: {
          './rer/sitesearch/browser/static/build/sitesearch-compiled.js':
            './rer/sitesearch/browser/static/build/sitesearch-compiled.js',
        },
      },
    },

    uglify: {
      sitesearch: {
        options: {
          sourceMap: true,
          sourceMapName: `./${productRoot}/build/sitesearch-compiled.js.map`,
          sourceMapIncludeSources: false,
        },
        files: {
          './rer/sitesearch/browser/static/build/sitesearch.min.js': [
            './rer/sitesearch/browser/static/build/sitesearch-compiled.js',
          ],
        },
      },
    },
    watch: {
      scripts: {
        files: [`${productRoot}/*.js`],
        tasks: ['requirejs', 'babel', 'uglify'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: `${productRoot}/*.scss`,
        tasks: ['sass', 'postcss', 'cssmin'],
        options: {
          livereload: true,
        },
      },
    },
  });

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', [
    'sass',
    'postcss',
    'cssmin',
    'requirejs',
    'babel',
    'uglify',
  ]);
};
