import React from 'react'
import i18n, { currentLanguage } from '.'
import eventbus from '../eventbus'
import uuid from 'uuid'

interface TranslatedTextProps extends React.Props<any> {
  code: string
}

interface TranslatedTextState {
  locale: string
}

export default class TranslatedText extends React.Component<TranslatedTextProps, TranslatedTextState> {
  
	constructor(props: TranslatedTextProps) {
    super(props)

    this.state = {
      locale: currentLanguage()
    }

    eventbus.addListener(eventbus.events.languageChanged, uuid(), () => {
      this.setState({
        locale: currentLanguage()
      })
    })
  }
  
  render() {
    if(!this.props.code) {
      throw Error("Missing code on TranslatedText")
    }

    return (
      <React.Fragment>
        {i18n(this.props.code)}
      </React.Fragment>
    )
  }
}
