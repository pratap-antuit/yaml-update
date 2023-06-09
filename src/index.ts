import * as core from '@actions/core'
import yaml from 'js-yaml'
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function writeTo(content: any, filePath: any) {
  const yamlString = yaml.dump(content)
  fs.writeFileSync(filePath, yamlString, 'utf8')
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function loopThroughObjRecurs(obj: any, parseObject: any) {
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      loopThroughObjRecurs(obj[k], parseObject[k])
    } else if (obj.hasOwnProperty(k)) {
      parseObject[k] = obj[k]
    }
  }
}

async function run(): Promise<void> {
  try {
    const inputs: any = core.getInput('data')
    core.info(`action input ${inputs} ...`)
    for (const k in inputs) {
      const yaml_data = yaml.load(fs.readFileSync(k, 'utf8'))
      const jsonObject = JSON.stringify(yaml_data, null, 4)
      const parseObject = JSON.parse(jsonObject)

      loopThroughObjRecurs(inputs[k], parseObject)
      writeTo(parseObject, k)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
