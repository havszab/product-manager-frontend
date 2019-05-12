// @flow
import axios from 'axios'
import eventbus from '../eventbus'

export const baseUrl: string = "http://localhost:9999/"
//process.env.baseUrl


export function getAxtiosInstance() {
  return axios.create({
    baseURL: baseUrl,
    timeout: 60000,
    headers: {}
  });
}

export const post = function post<T>(uri: string, body?: Object): Promise<T> {
  return new Promise((resolve, reject) => {
    getAxtiosInstance().post(baseUrl + uri, body).then(result => {
      resolve(result.data)
    }).catch(error => {
      //console.error(error)
      if (error.response && error.response.status === 401) {
        eventbus.notify(eventbus.events.logout)
      }
      reject(error)
    })

  })
}

export const get = function get<T>(uri: string, params?: Object): Promise<T> {
  return new Promise((resolve, reject) => {
    getAxtiosInstance().get(baseUrl + uri, {
      params: params
    }).then(result => {
      resolve(result.data)
    }).catch(error => {
      //console.error(error)
      if (error.response && error.response.status === 401) {
        eventbus.notify(eventbus.events.logout)
      }
      reject(error)
    })
  })
}

export const deleteReq = (uri: string, params?: Object) => {
  return new Promise((resolve, reject) => {
    getAxtiosInstance().delete(baseUrl + uri, {
      params: params
    }).then(result => {
      resolve(result.data)
    }).catch(error => {
      //console.error(error)
      if (error.response && error.response.status === 401) {
        eventbus.notify(eventbus.events.logout)
      }
      reject(error)
    })
  })
}

export const download = async (uri: string, filename: Function) => {
  return new Promise((resolve, reject) => {
    getAxtiosInstance().get(baseUrl + uri, {
      responseType: 'blob'
    }).then(result => {
      console.log(result)
      const url = window.URL.createObjectURL(new Blob([result.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename())
      document.body.appendChild(link)
      link.click()
    }).catch(error => {
      reject(error)
    })
  })
}
