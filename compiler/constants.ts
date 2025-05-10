import path from 'path'

export const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export const outputFolder = 'api'
export const outputPath = path.resolve(process.cwd(), outputFolder)