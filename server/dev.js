import { resolve } from "path"
import { get as getRoot } from "app-root-dir"
import dotenv from "dotenv"
import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"

// import configBuilder from "../webpack/builder"

// Initialize environment configuration
dotenv.config()

const ROOT = getRoot()
const CLIENT_OUTPUT = resolve(ROOT, process.env.CLIENT_OUTPUT)
const PUBLIC_PATH = process.env.PUBLIC_PATH
const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT

/* eslint-disable no-console */

const clientConfig = configBuilder({
  target: "client",
  env: "development"
})

const serverConfig = configBuilder({
  target: "server",
  env: "development"
})

const multiCompiler = webpack([ clientConfig, serverConfig ])
const clientCompiler = multiCompiler.compilers[0]

const server = express()

server.use(webpackDevMiddleware(multiCompiler, {
  // required
  publicPath: PUBLIC_PATH,

  // display no info to console (only warnings and errors)
  noInfo: true
}))

server.use(webpackHotMiddleware(clientCompiler))

// keeps serverRender updated with arg: { clientStats, outputPath }
server.use(webpackHotServerMiddleware(multiCompiler, {
  serverRendererOptions: {
    outputPath: CLIENT_OUTPUT
  }
}))

server.listen(DEVELOPMENT_PORT, () => {
  console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
})
