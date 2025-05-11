import webpack from "webpack"
import { baseConfig } from "./webpack-config"
import { mode, outputPath } from "./constants"
import { spawn } from 'child_process'
import path from 'path'

async function compile() {

  let scriptProcess: any

  // Handle process termination signals
  process.on('SIGINT', handleProcessTermination)
  process.on('SIGTERM', handleProcessTermination)
  process.on('exit', handleProcessTermination)

  function handleProcessTermination() {
    if (scriptProcess) {
      scriptProcess.kill()
      scriptProcess = null
    }
  }

  // Run webpack for both configurations
  const compiler = webpack(baseConfig, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }

    if (stats?.hasErrors()) {
      console.error(stats.toString({
        colors: true,
        chunks: false
      }))
      return
    }

    if (stats?.endTime && stats?.startTime) {
      console.log(`Compiled in ${stats.endTime - stats.startTime}ms`);
    }

    if (mode === 'production') {
      // Close the compiler when done
      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(closeErr)
        }
      })
    } else {
      // In development mode, run the compiled script directly
      const scriptPath = path.join(outputPath, 'index.js')

      // Kill previous process if it exists
      handleProcessTermination()

      // Start new process
      scriptProcess = spawn('node', [scriptPath], { stdio: 'inherit' })
    }
  })
}



compile()