import {CascaderOptionType} from 'antd/es/cascader'
import i18n from '../i18n'

export const convertToCascaderType = (container: Array<any>, translate?: boolean, labelKey?: string): Array<CascaderOptionType> => {
  let options = Array<CascaderOptionType>()
  for (let item of container) {
    if (translate)
      options.push({
        label: labelKey ? item[labelKey] : i18n('' + item.toString().toLowerCase()),
        value: item
      })
    else
      options.push({
        label: labelKey ? item[labelKey] : item,
        value: item
      })
  }
  return options
}
