// const path = require("path");
// const resolve = (dir) => path.join(__dirname, dir);
const defaultSettings = require("./src/config/index");
const name = defaultSettings.title || "vue_demo";
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

// externals
const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
};
// CDN外链，会插入到index.html
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  build: {
    css: ["https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.css"],
    js: [
      "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
      "https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js",
      "https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js",
      "https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js",
      "https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.min.js",
    ],
  },
};
module.exports = {
  publicPath: "./", // 署应用包时的基本 URL。 vue-router hash 模式使用
  //  publicPath: '/app/', // 署应用包时的基本 URL。  vue-router history模式使用
  outputDir: "dist", //  生产环境构建文件的目录
  assetsDir: "static", //  outputDir的静态资源(js、css、img、fonts)目录
  // lintOnSave: !IS_PROD,
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    port: 8080, // 端口号
    open: false, // 启动后打开浏览器
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true,
    },
    // ...
  },
  css: {
    loaderOptions: {
      // 给 scss-loader 传递选项
      scss: {
        // 注入 `sass` 的 `mixin` `variables` 到全局, $cdn可以配置图片cdn
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `@import "~@/assets/css/index.scss";@import "~@/assets/css/mixin.scss";@import "~@/assets/css/variables.scss";`,
      },
    },
  },
  chainWebpack: (config) => {
    if (IS_PROD) {
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static",
        },
      ]);
      /**
       * 添加CDN参数到htmlWebpackPlugin配置中
       */
      config.plugin("html").tap((args) => {
        if (IS_PROD) {
          args[0].cdn = cdn.build;
        } else {
          args[0].cdn = cdn.dev;
        }
        return args;
      });
    }
  },
  configureWebpack: (config) => {
    config.name = name;
    // 为生产环境修改配置...
    if (IS_PROD) {
      // externals
      config.externals = externals;
    }
  },
};
