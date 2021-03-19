const IS_PROD = ["production", "prod"].includes(process.env["VUE_APP_ENV "]);
const plugins = [];
if (IS_PROD) {
  plugins.push("transform-remove-console");
}
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins,
};
