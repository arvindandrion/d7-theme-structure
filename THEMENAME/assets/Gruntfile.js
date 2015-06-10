module.exports = function(grunt) {
  grunt.initConfig({
    theme_name: 'THEMENAME', //Change this to your theme name
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
        separator: '\n\n',
        banner: '(function ($, Drupal) { Drupal.behaviors.<%= theme_name %> = { attach: function(context, settings) {\nvar basePath = Drupal.settings.basePath;\nvar pathToTheme = Drupal.settings.pathToTheme;\n\n',
        footer: '\n\n}};})(jQuery, Drupal);',
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
      cc_registry: {
        args: ['cc', 'all']
      }
      // cc_theme_registry: {
      //   args: ['cc', 'theme-registry']
      // },
      // cc_css_js: {
      //   args: ['cc', 'css-js']
      // },
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
        tasks: ['concat'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-drush');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['sass', 'concat', 'uglify']);
  grunt.registerTask('drush', ['drush']);
  grunt.registerTask('default', ['watch']);
}