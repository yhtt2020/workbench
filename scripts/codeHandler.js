const path = require('path')
const fs = require('fs')
const javaScriptObfuscator = require('javascript-obfuscator')

function codeHandle (outFile) {
  console.log(outFile)
  let content = fs.readFileSync(outFile, 'utf-8')
  let result = javaScriptObfuscator.obfuscate(content, {
    compact: false,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArrayThreshold: 1
  })
  let outputContent = result.getObfuscatedCode()
  fs.writeFileSync(outFile, outputContent)
}

codeHandle(path.resolve(__dirname, '../main.build.js'))
codeHandle(path.resolve(__dirname, '../dist/bundle.js'))
