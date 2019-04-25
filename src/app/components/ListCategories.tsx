import React from "react";
import {Input, List, Row, Popconfirm, message} from "antd";
import Icon from "antd/lib/icon";
import Form from "antd/lib/form";
import {WrappedFormUtils} from "antd/lib/form/Form";
import {deleteReq, post} from "../libs/utils/request";

type props = {
  form: WrappedFormUtils
  categories: Array<Category>
  title: string
  categoryInstance: string //'PRODUCT' || 'UNIT'
}
type state = {
  editingId: number
}

interface Category {
  id: number
  name: string
}

class ListCategories extends React.Component<props, state> {
  state = {
    editingId: -1
  }

  getListData = (): Array<{}> => {
    let list = Array<{}>()
    if (this.props.categories != null)
    for (let item of this.props.categories) {
      list.push({
        title: item.name,
        id: item.id
      })
    }
    return list
  }

  editCategoryHandler = (id: number, name: string) => {
    this.setState({
      editingId: id
    })
  }

  saveCategoryHandler = async (id: number, name: string) => {
    if (this.props.categoryInstance === 'PRODUCT') {
      await post('set-product-category', {id: id, name: name})
        .then((response: {success: boolean, message: string}) => {
          response.success ? message.success(message) : message.error(message)
        })
    } else if (this.props.categoryInstance === 'UNIT') {
      await post('set-unit-category', {id: id, name: name})
        .then((response: {success: boolean, message: string}) => {
          response.success ? message.success(message) : message.error(message)
        })
    }
  }

  closeEditHandler = () => {
    this.setState({
      editingId: -1
    })
  }

  deleteConfirmHandler = async (id: number) => {
    if (this.props.categoryInstance === 'PRODUCT') {
      await deleteReq('delete-product-category', {id: id})
        .then((response: {success: boolean, message: string}) => {
          response.success ? message.success(message) : message.error(message)
        })
    } else if (this.props.categoryInstance === 'UNIT') {
      await deleteReq('delete-unit-category', {id: id})
        .then((response: {success: boolean, message: string}) => {
          response.success ? message.success(message) : message.error(message)
        })
    }
  }

  deleteCancelHandler = (e: Event) => {

  }

  render() {
    const {getFieldDecorator} = this.props.form

    const listData = this.getListData()


    return (
      <div style={{padding: 10, border: '1px solid #ccc', fontSize: '1.3em', width: '30%'}}>
        <h3>{this.props.title}</h3>
        <List dataSource={listData} renderItem={(item: {title: string, id: number}) => (
          item.id != this.state.editingId ? <List.Item key={item.title} actions={[
            <div onClick={() => this.editCategoryHandler(item.id, item.title)}><Icon type={'edit'} /></div>,
              <Popconfirm title="Category will be deleted!" onConfirm={() => this.deleteConfirmHandler(item.id)} onCancel={() => this.deleteCancelHandler} okText="Agree" cancelText="Cancel">
                <div><Icon type={'close'} /></div>
              </Popconfirm>]}>
            <List.Item.Meta title={item.title}/>
          </List.Item> :
            <Form>
              <List.Item key={item.title} actions={[<div onClick={() => this.saveCategoryHandler(item.id, item.title)}><Icon type={'save'} /></div>, <div onClick={this.closeEditHandler}><Icon type={'rollback'} /></div>]}>
                <Form.Item>
                  {getFieldDecorator('name', {initialValue: item.title,
                    rules: [{required: true, message: 'Field is required'}],
                  })(
                    <Input type={"text"} style={{height: 25}} />
                  )}
                </Form.Item>
              </List.Item>
            </Form>
        )}/>
      </div>
    )
  }

}

export default Form.create()(ListCategories);
