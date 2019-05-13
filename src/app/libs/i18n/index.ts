import get from 'lodash/get'
import moment from 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/hu'

type TranslationMap = {
  language: string,
  texts: Object
}

type CountryInfo = {
  language: string,
  info: { [key: string]: string }
}

const availableCountryInfo: CountryInfo[] = [
  {
    language: 'en',
    info: require('./countries/en.json')
  },
  {
    language: 'hu',
    info: require('./countries/hu.json')
  },
  {
    language: 'dev',
    info: {}
  },
]

const availableTranslations: TranslationMap[] = [
  {
    language: 'en',
    texts: require('./en.json')
  },
  {
    language: 'hu',
    texts: require('./hu.json')
  },
  {
    language: 'dev',
    texts: {}
  },
]
const defaultLanguage = 'hu'

let language = localStorage.getItem('language')
if (!language) {
  localStorage.setItem('language', defaultLanguage)
  language = defaultLanguage
}
const languageIsAvailable = Object.keys(availableTranslations).includes(language)
if (!languageIsAvailable) {
  language = defaultLanguage
}
moment.locale(language)

export const currentLanguage = () => {
  return language
}

const getTranslation = (key: string, args: Map<string, string> = new Map()) => {
  if (language === 'dev') {
    return key
  }
  try {
    let text = get(availableTranslations.find(translationmap => translationmap.language === language).texts, key) || get(availableTranslations.find(translationmap => translationmap.language === 'en').texts, key)
    args.forEach((value: string, key: string) => {
      const regexp = new RegExp(`\{\{${key}\}\}`)
      text = text.replace(regexp, value)
  })

    if (text) {
      return text
    }

  } catch (error) {
    console.log(error)
  }

  return key
}

const i18n = getTranslation
export default i18n

export const getCountryName = (code: string) => {
  if (!code) {
    throw Error('No country code')
  }
  const countryInfo: CountryInfo = availableCountryInfo.find(countryInfo => countryInfo.language === language)
  const countryName = countryInfo.info[code.toUpperCase()]
  if (!countryName) {
    return code
  }
  return countryName
}

export const getCountryData = (language: string) => {
  return availableCountryInfo.find(countryInfo => countryInfo.language === language)
}

export const tableLocale = () => {
  return {
    filterConfirm: getTranslation('general.table.filter.confirm'),
    filterReset: getTranslation('general.table.filter.reset'),
    emptyText: getTranslation('general.table.filter.emptyText')
  }
}

export const datePickerLocale = () => {

  return {
    lang: {
      placeholder: getTranslation('general.datePicker.placeholder'),
      rangePlaceholder: [
        getTranslation('general.datePicker.startDate'),
        getTranslation('general.datePicker.endDate')
      ],
      today: getTranslation('general.datePicker.today'),
      now: getTranslation('general.datePicker.now'),
      ok: getTranslation('general.datePicker.ok'),
      clear: getTranslation('general.datePicker.clear'),
      timeSelect: getTranslation('general.datePicker.timeSelect'),
      dateSelect: getTranslation('general.datePicker.dateSelect'),
      dateTimeFormat: "YYYY.MM.DD HH:mm",
      dateFormat: "YYYY.MM.DD",
      yearFormat: "YYYY",
      monthFormat: "MMMM",
    }
  }
}

export const setLanguage = (lang: string) => {
  localStorage.setItem('language', lang)
  language = lang
}
