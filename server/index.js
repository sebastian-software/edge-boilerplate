import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware-multi-compiler"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"
import clientConfig from "../webpack/client.dev"
import serverConfig from "../webpack/server.dev"

const DEV = process.env.NODE_ENV === "development"
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

if (DEV) {
  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers[0]

  app.use(webpackDevMiddleware(multiCompiler, { publicPath }))
  app.use(webpackHotMiddleware(clientCompiler))
  app.use(

    // keeps serverRender updated with arg: { clientStats, outputPath }
    webpackHotServerMiddleware(multiCompiler, { serverRendererOptions: { outputPath } }),
  )
} else {
  const clientStats = require("../build/client/stats.json")
  const serverRender = require("../build/server/main.js").default

  app.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats, outputPath }))
}

app.listen(3000, () => {
  console.log("Listening @ http://localhost:3000/")
})
