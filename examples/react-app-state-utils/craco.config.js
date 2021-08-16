// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  jest: {
    configure: {
      setupFiles: "./tests/setupFiles.js",
      setupFilesAfterEnv: "./tests/setupTests.js",
    },
  },
};
