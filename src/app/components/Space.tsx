import * as React from "react"
import { Tabs, Table, List, Divider, Button } from 'antd'
import { PDFExport } from '@progress/kendo-react-pdf'

enum Size { xs = 8, sm = 16, md = 24, lg = 32, xl = 48, xxl = 64 }

interface SpaceProps extends React.Props<any> {
  height: string | number
}

export default class Space extends React.Component<SpaceProps, {}> {

  render() {
    const heightProp: string | number = this.props.height
    let height: number
    if (!heightProp) {
      height = Size.md
    } else {
      if (typeof heightProp === 'string') {
        switch (heightProp) {
          case 'xs':
            height = Size.xs
            break
          case 'sm':
            height = Size.sm
            break
          case 'md':
            height = Size.md
            break
          case 'lg':
            height = Size.lg
            break
          case 'xl':
            height = Size.xl
            break
          case 'xxl':
            height = Size.xxl
            break
        }
      }
    }

    return <Divider style={{ height: 0, marginTop: height / 2, marginBottom: height / 2 }} />
  }
}