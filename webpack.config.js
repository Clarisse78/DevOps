const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        login: './src/login.js',
        assessments: './src/assessments.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    devtool: 'inline-source-map',
    watch: true
}