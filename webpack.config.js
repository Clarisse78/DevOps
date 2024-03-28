const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        login: './src/login.js',
        assessments: './src/assessments.js',
        assessmentsList: [
            './src/assessmentsList/assessmentsList.js',
            './src/assessmentsList/viewAssessment.js',
            './src/assessmentsList/createAssessment.js',
            './src/assessmentsList/editAssessment.js'
        ],
        calendar: './src/calendar.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    devtool: 'inline-source-map',
    watch: true
}