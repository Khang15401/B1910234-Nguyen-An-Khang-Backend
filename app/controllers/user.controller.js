const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.create(req.body);
    return res.send(document);
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, "An error occurred while creating the user")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const userService = new UserService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await userService.findByName(name);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving users")
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(500, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error rerieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  // return res.send({message: "Contact "})
  try {
    const userService = new UserService(MongoDB.client);
    const documents = await userService.update(req.params.id, req.body);
    if (!documents) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const documents = await userService.delete(req.params.id);
    if (!documents) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "User was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};

// exports.deleteAll = async (req, res, next) => {
//   try {
//     const contactService = new ContactService(MongoDB.client);
//     const deletedCount = await contactService.deleteAll();
//     return res.send({
//       message: `${deletedCount} contacts were deleted successfully}`,
//     });
//   } catch (error) {
//     return next(
//       new ApiError(500, "An error occurred while removing all contacts")
//     );
//   }
// };

// exports.findAllFavorite = async (req, res, next) => {
//   try {
//     const contactService = new ContactService(MongoDB.client);
//     const documents = await contactService.findFavorite();
//     return res.send(documents);
//   } catch (error) {
//     return next(
//       new ApiError(500, "An error occurred while retrieving favorite contacts")
//     );
//   }
// };

