import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data)
}

const update = (id, newObject) => {
  const updateUrl = `${baseUrl}/${id}`
  return axios.put(updateUrl, newObject).then((response) => response.data)
}

const deletePerson = (id) => {
  const deleteUrl = `${baseUrl}/${id}`
  return axios.delete(deleteUrl).then((response) => response.status)
}

export default { getAll, create, update, deletePerson }
