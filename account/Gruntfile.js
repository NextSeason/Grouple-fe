/**
 * @file Gruntjs configuration file
 * @author LvChengbin( kelcb@163.com )
 */

'use strice';

module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg : grunt.file.readJSON( 'package.json' ),
        domain : 'www.grouple.cn',
        dist : 'output',
        module : 'account',
        localdeploypath : '/Users/lvchengbin/Projects/Grouple',
        copy : {
            html : {
                files : [ {
                    expand : true,
                    cwd : 'html/',
                    src : [ '**/*.html' ],
                    dest : '<%= dist %>/html/<%= module %>/'
                } ]
            },
            stc : {
                files : [ {
                    expand : true,
                    src : [ 
                        'js/**/*.js', 'packages/**/*.js',
                        'images/**/*.png', 'packages/**/*.png',
                        'images/**/*.gif', 'packages/**/*.gif',
                        'fonts/**/*.eot', 'packages/**.*.eot'
                    ],
                    dest : '<%= dist %>/static/<%= module %>/'
                } ]
            },
            deploy : {
                files : [ {
                    expand : true,
                    cwd : '<%= dist %>',
                    src : [
                        'html/**/*',
                        'static/**/*'
                    ],
                    dest : '<%= localdeploypath %>'
                } ]
            }
        },
        compass : {
            scss : {
                options : {
                    sassDir : 'scss',
                    cssDir : '<%= dist %>/static/<%= module %>/css/',
                    relativeAssets : false
                }
            },
            packages : {
                options : {
                    sassDir : 'packages',
                    cssDir : '<%= dist %>/static/<%= module %>/packages/',
                    relativeAssets : false
                }
            }
        },

        /**
         * uglify js files
         */
        uglify : {
            target : {
                files : [ {
                    expand : true,
                    src : '<%= dist %>/**/*.js'
                } ]
            }
        },

        cssmin : {
            target : {
                files : [ {
                    expand : true,
                    src : [ '<%= dist %>/**/*.css' ]
                } ]
            }
        },
        watch : {
            dev : {
                files : [ 
                    'packages/**/*', 
                    'html/**/*', 
                    'js/**/*', 
                    'scss/**/*', 
                    'fonts/**/*',
                    'images/**/*'
                ],
                tasks : [ 'default', 'depoly' ]
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compass' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

    grunt.registerTask( 'remove', function( e ) {
        grunt.file.delete( 'output', { force : true } );
    } );

    grunt.registerTask( 'base', [ 'remove', 'compass', 'copy:html', 'copy:stc' ] );

    grunt.registerTask( 'default', [ 'base', 'copy:deploy' ] );

    /**
     * online - with different configuration value and compress js&css files
     */
    grunt.registerTask( 'online', [ 'base', 'uglify', 'cssmin' ] );
};
