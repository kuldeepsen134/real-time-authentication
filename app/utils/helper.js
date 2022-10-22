const nodemailer = require('nodemailer')

exports.handleError = (error, req, res,) => {
  if (error.details) {
    error.details.map((item) => {
      res.status(400).send({
        message: item.message.replace(/"/g, ''),
        error: true
      })
    })
    return
  }
  
  res.status(400).send({
    message: error.error ? error.error.message : error.errors ? error.errors.map(e => e.message) : error?.original?.sqlMessage ? error?.original?.sqlMessage : error.message ? error : error,
    error: true,
  })
}

exports.handleResponse = (res, data, message) => {

  if (res.req.method === 'POST' || res.req.method === 'PUT' || res.req.method === 'DELETE') {

    res.req.method === 'PUT' || res.req.method === 'DELETE' ? res.status(200).send({ message, error: false }) : res.status(200).send({ data, message, error: false })

  } else
    res.status(200).send({ ...data, message })

}

const { Op } = require('sequelize')

exports.handleSearchQuery = (req, fields,) => {

  const { filters, q } = req.query
  const query = []

  let queryKeys = fields.map((key) => {

    return { [key]: { [Op.like]: `${q}` } }
  })

  q && query.push({
    [Op.or]: queryKeys
  })

  filters && query.push(filters)

  return query
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 10
  const offset = page ? (page - 1) * limit : 0

  return { limit, offset }
}

exports.getPagingResults = (data, page, limit) => {
  const { count: total_items, rows: items } = data
  const current_page = page ? +page : 1
  const total_pages = Math.ceil(total_items / limit)
  const per_page = limit

  return { items, pagination: { total_items, per_page, total_pages, current_page } }
}

exports.createUUID = () => {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })

  return uuid
}

exports.sortingData = (req) => {
  const { sort } = req.query

  const sortKey = sort ? sort.replace('-', '') : 'created_at'
  const sortValue = sort ? sort.includes('-') ? 'DESC' : 'ASC' : 'DESC'

  return { sortKey, sortValue }
}
