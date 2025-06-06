import path from 'path'
import { fileURLToPath } from 'url'
import type webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { mode } from './constants'
import { deleteSync } from 'del'
import { outputFolder } from './constants'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(rootDir, 'src')

// Base configuration for both CJS and ESM
export const baseConfig: webpack.Configuration = {
  mode,
  watch: mode === 'development',
  devtool: mode === 'production' ? false : 'source-map',
  entry: path.resolve(srcDir, 'index.ts'),
  target: 'node',
  externals: [nodeExternals({ importType: 'module' })],
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: false,
                decorators: true
              },
              target: 'es2020'
            },
            module: {
              type: 'es6'
            }
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: mode === 'production'
  },
  output: {
    path: path.resolve(rootDir, outputFolder),
    filename: 'index.js',
    library: {
      type: 'module'
    },
    module: true,
    environment: {
      module: true
    }
  },
  plugins: [
    {
      apply: (compiler) => {
        let isFirstCompile = true
        compiler.hooks.beforeCompile.tap('DeleteDistPlugin', () => {
          if (isFirstCompile) {
            deleteSync([`${outputFolder}/**/*`])
            isFirstCompile = false
          }
        })
      }
    }
  ]
}