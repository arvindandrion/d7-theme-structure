module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: [
          'bower_components/foundation/scss',
          require('node-bourbon').includePaths
        ]
      },
      dist: {
        options: { outputStyle: 'compressed' },
        files: { 'css/app.css': 'scss/app.scss' }
      }
    },

    concat: {
      options: {
        separator: '\n\n\n',
        // sourceMap: true
      },
      dist: {
        src: 'js/modules/*.js',
        dest: 'js/app.js',
      },
    },

    uglify: {
      my_target: {
        options: {
          mangle: false
        },
        files: {
          'js/app.min.js': 'js/app.js'
        }
      }
    },

    drush: {
       cc_theme_registry: {
         args: ['cc', 'theme-registry']
       },
       cc_css_js: {
         args: ['cc', 'css-js']
       }
     },

    watch: {
      options: { reload: true },
      grunt: { files: ['Gruntfile.js'] },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        }
      },
      templates: {
        files: '../templates/*.tpl.php',
        tasks: ['drush:cc_theme_registry']
      },
      includes: {
        files: ['/sites/all/modules/custom/**/*.inc', '/sites/all/modules/custom/**/*.info'],
        tasks: ['drush:cc_registry'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-drush');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['sass', 'concat', 'uglify']);
  grunt.registerTask('default', ['build','watch']);
}