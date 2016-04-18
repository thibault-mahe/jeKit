module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		//Gruntfile var

		vendorsPath : './vendor',
		srcAssets : './src/_assets',
		buildAssets : './src/assets',
		pkg: grunt.file.readJSON('package.json'),

		//Tasks for JavaScript

		eslint: {
			options: {
				useEslintrc: true,
			},
			target: ['<%= srcAssets %>/js/*.js']
		},

		browserify: {
			dist: {
				options: {
					transform: [["babelify", { "presets": ["es2015"] }]]
				},
				files: {
					"<%= buildAssets %>/js/main-babelified.js": "<%= srcAssets %>/js/main.js"
				}
			}
		},

		concat: {
			options: {
				separator: ';\n', // Avoid syntax error on Smart-Table concat
			},
			main: {
				src: ['<%= vendorsPath %>/jquery/dist/jquery.js',
				'<%= vendorsPath %>/bootstrap-sass/assets/javascripts/bootstrap.js',
				'<%= buildAssets %>/js/main-babelified.js'],
				dest: '<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.js',
				nonull: true,
			},
			ieSupport: {
				src: ['<%= vendorsPath %>/html5shiv/dist/html5shiv.js',
				'<%= vendorsPath %>/respond/dest/respond.src.js'],
				dest: '<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js',
				nonull: true,
			}
		},

		uglify : {
			options: {
				mangle: false
			},
			js: {
				files: {
					'<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js' : [ '<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.js' ],
					'<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.min.js' : ['<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js']
				}
			}
		},

		//Tasks for CSS

		postcss: {
			options: {
				map: true,
				processors: [
				require('autoprefixer')({browsers: ['last 2 versions']})
				]
			},
			dist: {
				options: {
					browsers: ['last 2 version', 'ie 9', 'Firefox > 20', 'Safari > 5'],
					flatten: true
				},
				files: {
					'<%= buildAssets %>/css/main.css' : ['<%= buildAssets %>/css/main.css'],
				}
			}
		},

		csso: {
			compress: {
				options: {
					report: 'min'
				},
				files: {
					'<%= buildAssets %>/css/main.min.css': '<%= buildAssets %>/css/main.css'
				}
			}
		},

		sass: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					'<%= buildAssets %>/css/main.css': '<%= srcAssets %>/scss/main.scss'
				}
			}
		},

		//When the critical css is generated, copy and paste it
		//to insert it in the adequate view.
		criticalcss: {
			home: {
				options:  {
					outputfile : '<%= srcAssets %>/criticalcss/critical-home.css',
					filename : '<%= buildAssets %>/css/main.css',
					url : 'http://localhost:9001',
					width: 1200,
					height: 900
				}
			}
		},

		//Tasks for images and fonts

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: '<%= srcAssets %>/im/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: '<%= buildAssets %>/im/'
				}]
			}
		},

		copy: {
			main: {
				files: [
				{expand: true, cwd: '<%= srcAssets %>/', src: ['fonts/**'], dest: '<%= buildAssets %>'},
				],
			},
		},

		//Tasks for jekyll

		jekyll: {
			options: {
				config: '_config.yml'
			},
			dist: {}
		},

		//Tasks for livereload

		connect: {
			localhost: {
				options: {
					port: 9001,
					open: {
						target: 'http://localhost:9001/'
					},
					keepalive: false,
					base: ['build'],
					livereload: false,
					hostname: 'localhost',
				}
			}
		},

		delta: {
			options: {
				livereload: true,
			},
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: [ 'eslint', 'browserify', 'concat', 'sass', 'postcss', 'csso', 'jekyll', 'clean'],
				options: {
					livereload: false
				}
			},
			sass: {
				files: ['<%= srcAssets %>/scss/*.scss', '<%= srcAssets %>/scss/*/*.scss'],
				tasks: ['sass', 'postcss', 'csso', 'jekyll', 'clean', 'csscount'],
			},
			script: {
				files: '<%= srcAssets %>/js/*.js',
				tasks: ['eslint', 'browserify', 'concat', 'uglify', 'jekyll', 'clean']
			},
			html: {
				files: ['<%= pkg.src %>/*.html', '<%= pkg.src %>/*/*.html', '<%= pkg.src %>/*/*/*.html'],
				tasks: ['sass', 'postcss', 'csso', 'jekyll', 'clean']
			},
			images: {
				files: ['<%= srcAssets %>/im/**/*.{png,jpg,gif,svg}'],
				tasks: ['imagemin']
			},
			fonts: {
				files: ['<%= srcAssets %>/fonts/**/*'],
				tasks: ['copy']
			}
		},

		//Tasks for stats

		pagespeed: {
			options: {
				nokey: true,
				url: "" //insert url here
			},
			prod: {
				options: {
					url: "", //insert url here
					locale: "en_GB",
					strategy: "desktop",
					threshold: 80
				}
			},
			paths: {
				options: {
					paths: [], //insert paths here
					locale: "en_GB",
					strategy: "desktop",
					threshold: 80
				}
			}
		},

		csscount: {
			dev: {
				src: [
				'<%= buildAssets %>/css/main.css'
				],
				options: {
					maxSelectors: 4095,
					maxSelectorDepth: false
				}
			}
		},

		//Tasks for grunt

		concurrent: {
			transform: ['browserify', 'sass'],
			minify: ['csso', 'uglify'],
			optim: ['imagemin']
		},

		clean: {
			dist: [
				"<%= buildAssets %>/js/main-babelified.js",
				"<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.js",
				"<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js",
				"<%= buildAssets %>/css/main.css",
				"<%= srcAssets %>/criticalcss/critical-home.css"
			]
		}

	});

grunt.registerTask('images', ['imagemin']);
grunt.registerTask('jek', ['jekyll']);
grunt.registerTask('critical', ['criticalcss']);
grunt.registerTask('stats', ['csscount', 'pagespeed']);
grunt.renameTask( 'watch', 'delta' );
grunt.registerTask('default', [
	'eslint',
	'concurrent:transform',
	'postcss',
	'csscount',
	'concat',
	'concurrent:minify',
	'copy',
	'jekyll',
	'connect:localhost',
	'delta',
	]);
grunt.registerTask('prod', [
	'eslint',
	'concurrent:transform',
	'postcss',
	'csscount',
	'concat',
	'concurrent:optim',
	'concurrent:minify',
	'copy',
	'jekyll',
	'clean'
	]);

};
