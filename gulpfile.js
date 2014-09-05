var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({lazy:false});

gulp.task('scripts', function(){
    //combine all js files of the app
    gulp.src(['!./app/**/*test.js',
        './app/app.js',
        './app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('templates',function(){
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        '!./app/auth.html',
        './app/**/*.html'])
        .pipe(plugins.angularTemplatecache('templates.js',{standalone:true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function(){
    gulp.src('./app/less/app.less')
        .pipe(plugins.less())
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorJS', function(){
    //concatenate vendor JS files
    gulp.src(['./bower_components/angular/*.js',
        '!./bower_components/angular/*.min.js',
        './bower_components/angular-cookies/*.js',
        '!./bower_components/angular-cookies/*.min.js',
        './bower_components/angular-route/*.js',
        '!./bower_components/angular-route/*.min.js',
        './bower_components/angular-mocks/*.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angularjs-toaster/toaster.js',
        './bower_components/underscore/underscore.js'])
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorCSS', function(){
    //concatenate vendor CSS files
    gulp.src(['!./bower_components/**/*.min.css',
        '!./bower_components/bootstrap/**/*.css',
        './bower_components/**/*.css'])
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorFonts', function(){
    gulp.src(['./bower_components/**/*.{ttf,woff,eof,svg}'])
    .pipe(plugins.flatten())
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('copy-index', function() {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('watch',function(){
    gulp.watch([
        'build/**/*.html',
        'build/**/*.js',
        'build/**/*.css'
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
    gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
    gulp.watch('./app/**/*.less',['css']);
    gulp.watch('./app/index.html',['copy-index']);

});

gulp.task('connect', plugins.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

gulp.task('build',['scripts','templates','css','copy-index','vendorJS','vendorCSS','vendorFonts']);
gulp.task('default',['connect','build','watch']);
