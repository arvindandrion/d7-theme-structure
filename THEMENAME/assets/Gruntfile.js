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
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss',
          'css/ie.css': 'scss/ie.scss',
          'css/ie9.css': 'scss/ie9.scss'
        }
      }
    },

//     drush: {
//        cc_theme_registry: {
//          args: ['cc', 'theme-registry']
//        },
//        cc_css_js: {
//          args: ['cc', 'css-js']
//        }
//      },


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

//       templates: {
//         files: '../templates/*.tpl.php',
//         tasks: ['drush:cc_theme_registry']
//       },

//       includes: {
//         files: ['/sites/all/modules/custom/**/*.inc', '/sites/all/modules/custom/**/*.info'],
//         tasks: ['drush:cc_registry'],
//       }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-drush');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);
}