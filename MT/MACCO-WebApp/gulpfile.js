const gulp = require('gulp');
const rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
const useref = require('gulp-useref');
const webserver = require('gulp-webserver');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');//文件更名  
const revappend = require('gulp-rev-append');
const clean = require('gulp-clean');

const runSequence = require('gulp-sequence');
const contentInclude = require('gulp-content-includer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const minimist = require('minimist');
const zip = require('gulp-zip');
const del = require('del');
//nodejs自带的监控文件夹插件
const chokidar = require('chokidar');
const addsrc = require('gulp-add-src');

const deldist = () => {
    return del('dist/**');
};
//task copy
const copy = () => {
    return gulp.src('app/**')
        .pipe(gulp.dest('dist'));
};

//task html
const html = () => {
    return gulp.src('dist/**/*.html')
        .pipe(contentInclude({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('dist'));
};

//指定上传文件夹，命令行传参数，例如：gulp task --path Activity/1
var knownOptions = {
    string: 'env',
    default: { path: process.env.NODE_ENV || 'production' }
};

//path 是指上面定义的knownOptions变量，包含两个参数[object,path]
var path = minimist(process.argv.slice(2), knownOptions);

//task pointdel
const pointdel = () => {
    return del('dist/' + path.path);
};

//task pointfile
const pointfile = () => {
    return gulp.src('app/' + path.path + '/**')
        .pipe(gulp.dest('dist/' + path.path));
};

//task pointclear
const pointclear = () => {
    return gulp.src(['dist/' + path.path + '/**/*.js', 'dist/' + path.path + '/**/*.css'])
        .pipe(clean({ force: true }));
};

//task pointmincss
const pointmincss = () => {
    return gulp.src('app/' + path.path + '/**/*.css')
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/' + path.path));
};

//task pointminjs
const pointminjs = () => {
    return gulp.src('app/' + path.path + '/**/*.js')
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/' + path.path));
};

//task pointhtml
const pointhtml = () => {
    return gulp.src('dist/' + path.path + '/**/*.html')
        .pipe(contentInclude({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(useref({
            noAssets: true
        }))
        .pipe(revappend())
        .pipe(gulp.dest('dist/' + path.path));
};

//task pointminimage
const pointminimage = () => {
    return gulp.src('dist/' + path.path + '/**/*.{png,jpg}')
        .pipe(imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist/' + path.path));
};

//task remove
const remove = () => {
    return gulp.src(['dist/**/*.css', 'dist/**/*.js', '!dist/JS/**'])
        .pipe(clean({ force: true }));
};

//task mincss
const mincss = () => {
    return gulp.src(['app/**/*.css', '!app/JS/**'])
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
};

//task minjs
const minjs = () => {
    return gulp.src(['app/**/*.js', '!app/JS/**'])
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
};

//task useref
const userefhtml = () => {
    return gulp.src('dist/**/*.html')
        .pipe(useref({
            noAssets: true
        }))
        .pipe(gulp.dest('dist'));
};

//task revhtml
const revhtml = () => {
    return gulp.src(['dist/**/*.html'])
        .pipe(revappend())
        .pipe(gulp.dest('dist'));
};

//task minimage
const minimage = () => {
    return gulp.src('dist/**/*.{png,jpg}')
        .pipe(imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist'));
};

//获取dist路径路径，eventpath是app路径，n是取app路径最后一个字符串
const patharray = (eventpath, n) => {
    var splitpath = new Array(); //定义一数组 
    var minpath = new Array(); //删除时重命名.min
    var concatpath = '';
    splitpath = eventpath.split("\\");
    for (var pathindex = 0; pathindex < splitpath.length; pathindex++) {
        if (splitpath[pathindex] == 'app') {
            splitpath[pathindex] = 'dist';
        }
    }
    if (n == 0) {
        var iscss = eventpath.indexOf('.css');
        var isjs = eventpath.indexOf('.js');
        if (iscss != -1 || isjs != -1) {
            //删除js和css
            for (var combineindex = 0; combineindex < splitpath.length; combineindex++) {
                if (combineindex != splitpath.length - 1) {
                    concatpath = concatpath.concat(splitpath[combineindex], '\\');
                } else {
                    minpath = splitpath[combineindex].split(".");
                    concatpath = concatpath.concat(minpath[0] + '.min.' + minpath[1]);
                }
            }
        } else {
            //删除非js和css
            for (var combineindex = 0; combineindex < splitpath.length; combineindex++) {
                if (combineindex != splitpath.length - 1) {
                    concatpath = concatpath.concat(splitpath[combineindex], '\\');
                } else {
                    concatpath = concatpath.concat(splitpath[combineindex]);
                }
            }
        }
    } else {
        //增加和修改
        for (var combineindex = 0; combineindex < splitpath.length - n; combineindex++) {
            if (combineindex != splitpath.length - 1 - n) {
                concatpath = concatpath.concat(splitpath[combineindex], '\\');
            } else {
                concatpath = concatpath.concat(splitpath[combineindex]);
            }
        }
    }
    return concatpath;
}

//更新dist文件，并且判断是否是html文件
const updatadist = (eventpath, concatpath) => {
    var ishtml = eventpath.indexOf('.html');
    var isjpg = eventpath.indexOf('.jpg');
    var ispng = eventpath.indexOf('.png');
    var iscss = eventpath.indexOf('.css');
    var isjs = eventpath.indexOf('.js');
    if (isjs == -1) {
        if (isjpg == -1 && ispng == -1) {
            if (iscss == -1) {
                if (ishtml == -1) {
                    gulp.src(eventpath)
                        .pipe(gulp.dest(concatpath));
                } else {
                    gulp.src(eventpath)
                        .pipe(contentInclude({
                            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
                        }))
                        .pipe(useref({
                            noAssets: true
                        }))
                        .pipe(gulp.dest(concatpath))
                        .pipe(addsrc(concatpath + '\\*.html'))
                        .pipe(revappend())
                        .pipe(gulp.dest(concatpath));
                }
            } else {
                gulp.src(eventpath)
                    .pipe(rename({ suffix: ".min" }))
                    .pipe(minifycss())
                    .pipe(gulp.dest(concatpath));
                revhtml()
            }
        } else {
            gulp.src(eventpath)
                .pipe(imagemin({
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
                    svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性
                    use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
                }))
                .pipe(gulp.dest(concatpath));
        }
    } else {
        gulp.src(eventpath)
            .pipe(rename({ suffix: ".min" }))
            .pipe(uglify())
            .pipe(gulp.dest(concatpath));
        revhtml()
    }
}

//实时监控文件及文件夹的变化
const watch = () => {
    var watcher = chokidar.watch(['app/**', '!app/JS/**'], { ignoreInitial: true, ignorePermissionErrors: true });
    watcher
        .on('add', (path) => {
            var destpath = patharray(path, 1);
            updatadist(path, destpath);
        })
        .on('addDir', (path) => {
            var destpath = patharray(path, 1);
            updatadist(path, destpath);
        })
        .on('change', (path) => {
            var destpath = patharray(path, 1);
            updatadist(path, destpath);
        })
        .on('unlink', (path) => {
            var destpath = patharray(path, 0);
            del(destpath);
        })
        .on('unlinkDir', (path) => {
            var destpath = patharray(path, 0);
            del(destpath);
        })
        .on('error', (error) => {
            console.log("error:", error);
        })
        .on('ready', () => {
            console.log("ready...");
        });
}

//----------------------------------------------------------------task-------------------------------------------------------------
gulp.task('deldist', () => {
    return deldist();
});

// only copy file from app to dist
gulp.task('copy', () => {
    return copy();
});

//删除dist中指定文件夹
gulp.task('pointdel', () => {
    return pointdel();
});

//替换指定文件
gulp.task('pointfile', () => {
    return pointfile();
});

//清除dist中指定文件中的css和js问件
gulp.task('pointclear', () => {
    return pointclear();
});

//压缩指定文件中的css
gulp.task('pointmincss', () => {
    return pointmincss();
});

//压缩指定文件中的js
gulp.task('pointminjs', () => {
    return pointminjs();
});

//版本话指定文件中html
gulp.task('pointhtml', () => {
    return pointhtml();
});

//压缩指定文件夹中的图片
gulp.task('pointminimage', () => {
    return pointminimage();
});

//include html
gulp.task('html', () => {
    return html();
});

//remove css and js in dist for add .min.css or .min,js
gulp.task('remove', () => {
    return remove();
});

//min and rename css in dist
gulp.task('mincss', () => {
    return mincss();
});

//min and rename js in dist
gulp.task('minjs', () => {
    return minjs();
});

//替换dist中html的连接，更改css和js的后缀为 .min.css and .min.js
gulp.task('useref', () => {
    return userefhtml();
});

//html链接版本化 @@hash
gulp.task("revhtml", () => {
    return revhtml();
});

gulp.task('minimage', () => {
    return minimage();
});

gulp.task('testminpng', () => {
    gulp.src('dist/minpng/*.{png,jpg}')
        .pipe(imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist/minpng'));
});

//1、刚从线上pull的代码，还没有生成dist的情况。

gulp.task('adddist', runSequence('deldist', 'copy', 'html', 'remove', 'mincss', 'minjs', 'useref', 'revhtml', 'minimage'));

//2、 增加文件夹 新增、修改css 新增、修改js，执行gulp watch 命令，注意：不能连级删除文件夹

gulp.task('watch', () => {
    watch();
}); 

//3、只更改指定的文件夹，例如Activity/1，更改了app，但是只想提交一部分。

gulp.task('pointpath', runSequence('pointdel', 'pointfile', 'pointclear', 'pointmincss', 'pointminjs', 'pointhtml', 'pointminimage'));

//4、webserver的开启，用于debug dist。

gulp.task('distserver', () => {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: {
                enable: true,
                path: 'dist'
            },
            open: true
        }));
    watch();
});

//5、压缩zip包   gulp zip --path Activity/1
gulp.task('zip', () => {
    var filepath = new Array(); //定义一数组 
    filepath = path.path.split("\/");
    var zipname = filepath[1];
    gulp.src('dist/' + path.path + '/**')
        .pipe(zip(zipname + '.zip'))
        .pipe(gulp.dest('dist/' + path.path));
});