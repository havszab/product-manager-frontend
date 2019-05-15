import {CascaderOptionType} from 'antd/es/cascader'

export const convertToCascaderType = (labelKey: string, container: Array<any>): Array<CascaderOptionType> => {
  let options =  Array<CascaderOptionType>()
  for (let item of container) {
    options.push({
      label: item[labelKey],
      value: item
    })
  }
  return options
}
