import axios from 'axios'
const baseUrl = '/api/persons';

const getAll = () => {
    return axios.get(baseUrl)
  }

  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }

  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
  }

  const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
  }

  const put = (id, obj) => {
    return axios.put(`${baseUrl}/${id}`, obj)
  }

  export default { getAll, create, update, remove, put }