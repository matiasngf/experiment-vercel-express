import fs from 'fs'
import path from 'path'

const dirName = path.resolve(process.cwd())

const logAll = () => {
  const files = fs.readdirSync(dirName)
  console.log('Files and folders in directory:')
  files.forEach(file => {
    const stats = fs.statSync(path.join(dirName, file))
    const type = stats.isDirectory() ? '📁' : '-'
    console.log(`${type} ${file}`)
  })
}

const createDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
}

function copyIndexFile() {

  logAll()

  createDir('api')

  const sourcePath = path.join(dirName, 'src/index.ts')
  const targetPath = path.join(dirName, 'api/index.ts')

  try {
    fs.copyFileSync(sourcePath, targetPath)
    console.log('Successfully copied index.ts to api directory')
  } catch (error) {
    console.error('Error copying file:', error)
  }
  logAll()
}

copyIndexFile()
