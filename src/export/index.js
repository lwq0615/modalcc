import fs from 'fs'
import path from 'path';
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const types = [
  'commonjs',
  "module"
]

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, dataStr) => {
      if (err) {
        reject(err)
      } else {
        resolve(dataStr)
      }
    })
  })
}

function writeFile(filePath, text) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const corePath = path.resolve(__dirname, '../index.js')
for (const type of types) {
  const tasks = [
    readFile(corePath),
    readFile(path.resolve(__dirname, `./${type}.js`))
  ]
  Promise.all(tasks).then(res => {
    const [coreText, exportText] = res
    const text = exportText.replace('$core$', coreText)
    writeFile(`./dist/${type}.js`, text)
  })
}