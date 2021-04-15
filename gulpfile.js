const { series, src, dest, watch, parallel } = require('gulp'); //Series permite ejecutar diferentes funciones en orden que se especifique, src indica en donde va a encontrar los archivos de sass, dest indica el destino del archivo css al compilar sass, watch compila automaticamente detectar cambios en el archivo sass
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

//Utilidades css
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

//Utilidades JS
const terser = require('gulp-terser-js');

//Funcion que compila SASS
const paths = {
    imagenes : 'src/img/**/*',
    scss : 'src/scss/**/*.scss',
    js : 'src/js/**/*.js'
}

function css() {
    return src(paths.scss) //identifica la hoja de estilos
        .pipe(sourcemaps.init())
        .pipe(sass()) //compila el archivo sass
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css')) //Guarda el archivo css en la direccion especificada
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix : '.min' }))
        .pipe(dest('./build/js'))
}

function minificarcss() {
    return src(paths.scss) //identifica la hoja de estilos
        .pipe(sass({
            outputStyle: 'compressed' //Cmabia la vista del codigo css sin saltos de linea
        })) //compila el archivo sass
        .pipe(dest('./build/css')) //Guarda el archivo css en la direccion especificada
}

function imagenes () {
    return src(paths.imagenes)
        .pipe(imagemin())
        .pipe(dest('./build/img'))
        .pipe(notify({ message : 'Imagen minificada'}));
}

function versionWebp () {
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('./build/img'))
        .pipe(notify({ message: 'Version Webp lista'}));
}

function watchArchivos() {
    watch(paths.scss, css); //* = carpeta actual, **= todos los archivos con esa extencion
    watch(paths.js, javascript);
}

exports.css = css;
exports.minificarcss = minificarcss;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;

exports.default = series( css, javascript, imagenes, versionWebp, watchArchivos );

//El archivo de gulp se ejecuta mediante el comando gulp nombre_funcion
//La funcion requiere como parametro la funcion done la cual se debe declarar al final de la funcion para indicar cuando finalizar su ejecuacion

