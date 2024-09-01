import fs from 'fs'
import path from 'path';
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import imports from './importArr.js'
import exportsText from './exportText.js'

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
    const [coreText, templateText] = res
    let text = templateText.replace('$core$', coreText).replace('$export$', exportsText)
    if (type === 'commonjs') {
      const importText = imports.map(item => {
        if (Array.isArray(item)) {
          return `const { ${item[0]} } = require('${item[1]}')`
        }else {
          return `require('${item}')`
        }
      }).join('\n')
      text = text.replace('$import$', importText)
    } else if (type === 'module') {
      const importText = imports.map(item => {
        if (Array.isArray(item)) {
          return `import { ${item[0]} } from '${item[1]}'`
        }else {
          return `import '${item}'`
        }
      }).join('\n')
      text = text.replace('$import$', importText)
    }
    writeFile(`./dist/${type}.js`, text)
  })
}