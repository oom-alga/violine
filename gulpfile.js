var gulp         = require("gulp");
var browserSync  = require("browser-sync");
var sass         = require("gulp-sass");
var pug          = require('gulp-pug');

gulp.task('sass', function () {
    return gulp.src('./serve/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function(){
    return gulp.src("./serve/js/*.js")
    .pipe(gulp.dest("./public/js"));
});

gulp.task('java', function(){
    return gulp.src([
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js", 
        "./node_modules/@fortawesome/fontawesome-free/js/all.js",
        "./node_modules/owl.carousel2/dist/owl.carousel.min.js",
        "./serve/js/*.js"
    ])
    .pipe(gulp.dest("./public/js"));
});

gulp.task('watch', function () {
    return gulp.src([
        "./resource/assets/sass/**/*.scss",
        "./node_modules/bootstrap/scss/bootstrap.scss",
        "./node_modules/@fortawesome/fontawesome-free/css/all.css",
        "./node_modules/owl.carousel2/dist/assets/owl.carousel.css",
    ])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('pug', function buildHTML() {
  return gulp.src('./serve/pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./public'));
});

gulp.task("serve",function(){
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    })
    
    gulp.watch('./serve/sass/**/*.scss', ['sass']).on("change",browserSync.reload);
    gulp.watch('./serve/js/**/*.js', ['js']).on("change",browserSync.reload);
    gulp.watch("./serve/pug/**/*.pug", ['pug']);

    gulp.watch("./serve/js/scrip.js").on("change",browserSync.reload);
    gulp.watch("./public/css/*.css").on("change",browserSync.reload);
    gulp.watch("./public/*.html").on("change",browserSync.reload);
});