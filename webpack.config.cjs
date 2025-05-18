const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new CopyPlugin({
            patterns: [
              { from: "resources", to: "resources" },
              { from: "css", to: "css" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,   
                type: 'asset/resource',
                generator: {
                    filename: 'resources/[name][ext]'
                }
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '...'],
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';        
    } else {
        config.mode = 'development';
    }
    return config;
};
