import React from 'react'
import { Form } from 'antd'
import Input from "antd/lib/input";

type Props = {
  key: string
  required: boolean 
  errorMessage: string 
  placeholder: string
  description: string
  disabled: boolean
  onChange: Function
  getFieldDecorator: Function
  loading: boolean
}

export default (options: Props) => {
  const {
    key, 
    required = true, 
    errorMessage, 
    placeholder, 
    description, 
    disabled, 
    onChange,
    getFieldDecorator,
    loading
  } = options
  return (
      <Form.Item key={key}>
        {getFieldDecorator(key, {
          onChange,
          rules: [{ required, message: errorMessage }]
        })(
            <Input placeholder={placeholder} disabled={loading || disabled}/>
        )}
        {
          description
          ? <p style={{ marginBottom: 0, marginTop: 4 }} className='form-item-description'>{description}</p>
          : null
        }
      </Form.Item>
  )
}