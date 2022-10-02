const {src, dest,watch, parallel} = require("gulp");
//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
//IMAGENES  
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JAVASCRIPT
const terser = requiere('gulp-terser-js');


function css(done){

    src('src/scss/**/*.scss')//identificar archivo SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) //Compilarlo
    .pipe(postcss([autoprefixer(),cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css"));//Almacenar en disco duro

    done();//callback que avisa que llegamos al final
}
function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))

    done();
}

function versionWebp (done){
    const opciones = {
        quality: 50
    };   
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))

    done();
}

function versionAvif (done){
    const opciones = {
        quality: 50
    };   
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done();
}

function javascript(done){
    src('src/js/**/*.js') //identificar archivos
    .pipe(terser())
    .pipe(dest('build/js'));

    done();
}

function dev(done){//watch es para que se quede esperando cambios y compile todo el tiempo
    watch("src/scss/**/*.scss",css);//cuando cambie este archivo manda llamar css de package.json
    watch("src/js/**/*.js",javascript);
    done();
}

exports.css = css;//asi se mandan llamar funciones
exports.js = javascript;//asi se mandan llamar funciones
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes,versionWebp,versionAvif,javascript, dev);