const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: "development",
    resolve: {
        alias: {
            config$: "./configs/app-config.js",
            react: "./vendor/react-master",
        },
        extensions: ["js", "jsx"],
        modules: [
            "node_modules",
            "bower_components",
            "shared",
            "/shared/vendor/modules",
        ],
    },
};
