import process from 'node:process'
import { resolve } from 'node:path'
import fs from 'node:fs'

const cwd = process.cwd()

const rulesDir = resolve(cwd, 'src', 'rules')

function camelCase(str: string) {
  return str
    .replace(/[^\w-]+/, '')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function generateRules() {
  const targetFile = 'index.ts'

  const header = '/* GENERATED BY SCRIPTS, DO NOT EDIT DIRECTLY */'

  const rules = fs.readdirSync(rulesDir)
    .filter(i => i !== targetFile)
    .map(i => i.replace('.ts', ''))

  const content = [
    header,
    ...rules.map(i => `import ${camelCase(i)}, { RULE_NAME as ${camelCase(i)}Name } from './${i}'`),
    '',
    'export default {',
    ...rules.map(i => `  [${camelCase(i)}Name]: ${camelCase(i)},`),
    '}',
    ''
  ].join('\n')

  fs.writeFileSync(resolve(rulesDir, targetFile), content)
}

generateRules()
