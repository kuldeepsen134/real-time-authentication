const { User } = require('../models/index')

const { handleError, handleSearchQuery, getPagination, getPagingResults, handleResponse, sortingData } = require('../utils/helper')
const { strings } = require('../utils/string')

const { createUser, updateUser } = require('./validator')

exports.create = async (req, res) => {

  const { error } = createUser.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const data = {
    name: req.body.name,
    email: req.body.email,
  }

  User.create(data)
    .then(data => {
      handleResponse(res, data, strings.accountSuccessfullyCreated)
    })
    .catch(err => {
      handleError(err, req, res)
    })
}

exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sortResponse = sortingData(req);

  User.findAndCountAll(
    {
      where: handleSearchQuery(req, ['name', 'email', 'id']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset,
    }
  )
    .then(data => {
      handleResponse(res, getPagingResults(data, page, limit));
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findOne = async (req, res) => {

  const id = req.params.id;

  const user = await User.findOne({ where: { id: id } })

  user === null ? handleError(strings.thisIdIsNotExist, req, res) :

    User.findByPk(id, {
    })
      .then(data => {
        handleResponse(res, data.dataValues);
      }).catch(err => {
        handleError(err, req, res);
      });
};

exports.update = async (req, res) => {

  const { error } = updateUser.validate(req.body,);

  if (error) {
    handleError(error, req, res)
    return
  }

  const id = req.params.id;


  const user = await User.findOne({ where: { id: id } })

  if (user === null) { handleError(strings.thisIdIsNotExist, req, res) }

  else {

    const data = {
      name: req.body.name,
      email: req.body.email,
    }

    User.update(data, { where: { id: id } })
      .then(data => {
        handleResponse(res, data, strings.userSuccessfullyUpdate);
      }).catch(err => {
        handleError(err, req, res);
      })
  }
};

exports.delete = async (req, res) => {

  const id = req.params.id;
  const user = await User.findOne({ where: { id: id } })

  user === null ? handleError(strings.thisIdIsNotExist, req, res) :

    User.destroy({
      where: { id: req.params.id }
    }).then(data => {
      handleResponse(res, data, strings.userSuccessfullyDelete);
    }).catch(err => {
      handleError(err, req, res);
    });
};
