var gulp = require('gulp'),
  livereload = require('gulp-livereload'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  gutil = require('gulp-util'),
  ngAnnotate = require('gulp-ng-annotate'),
  beep = require('beepbeep'),
  header = require('gulp-header'),
  wrap = require("gulp-wrap"),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  minifycss = require('gulp-minify-css'),
  autoprefixer = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber');
  karma = require('karma').server,
  package = require('./package.json');

var dirs = {
  js: {
    src: './source/js',
    dest: './build/js'
  },
  demo: {
    src: './source/demo',
    dest: './demo'
  },
  test: {
    src: './source/js',
    dest: './karma'
  }
};

var jsHeader = [
  '// Nicholas Johnson (www.nicholasjohnson.com)',
  '// Forward Advance Training (www.forwardadvance.com)',
  '// MIT licence'
].join('\n');

gulp.task('js', function () {
  return gulp.src([dirs.js.src, '*.js'].join('/'))
    .pipe(wrap('(function() {\n<%= contents %>\n})();'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('error', beep)
    .pipe(concat(package.name + '.js'))
    .pipe(ngAnnotate())
    .on('error', gutil.noop)
    .pipe(header(jsHeader + '\n\n'))
    .pipe(gulp.dest(dirs.js.dest))
    .pipe(rename(package.name + '.min.js'))
    .pipe(uglify())
    .on('error', gutil.noop)
    .pipe(header(jsHeader + '\n\n'))
    .pipe(gulp.dest(dirs.js.dest))
    .pipe(livereload());
});

gulp.task('testJs', function () {
  return gulp.src([dirs.test.src, '*.js'].join('/'))
    .pipe(wrap(
      [
        '(function() {',
          '<%= contents %>',
          '// Smuggle locals out of closure for testing',
          'window.placeholder = placeholder;',
          'window.hitZones = hitZones;',
          'window.widget = widget;',
        '})();'
      ].join('\n')
    ))
    .pipe(concat(package.name + '.testable.js'))
    .pipe(ngAnnotate())
    .on('error', gutil.noop)
    .pipe(header(jsHeader + '\n\n'))
    .pipe(gulp.dest(dirs.test.dest));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('demo:jade', function() {
  return gulp.src([dirs.demo.src, '**', '*.jade'].join('/'))
    .pipe(jade({basedir: __dirname, pretty:true}))
    .on('error', gutil.log)
    .pipe(gulp.dest(dirs.demo.dest));
})

gulp.task('demo:js', function() {
  return gulp.src([dirs.demo.src, '**', '*.js'].join('/'))
    .pipe(gulp.dest(dirs.demo.dest));
})

gulp.task('demo:sass', function() {
  return gulp.src([dirs.demo.src, '**', '*.scss'].join('/'))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .on('error', gutil.log)
    .pipe(gulp.dest(dirs.demo.dest));
})

gulp.task('demo', ['demo:jade', 'demo:js', 'demo:sass']);

gulp.task('watch', function() {
  gulp.watch([dirs.js.src, '**', '*.js'].join('/'), ['js', 'testJs']);
  gulp.watch([dirs.demo.src, '**', '*'].join('/'), ['demo']);
});

gulp.task('default', [
  'js',
  'tdd',
  'watch'
]);
