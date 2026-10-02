const express = require("express");
const userController = require("../controllers/user.controller");
const petController = require("../controllers/pet.controller");
const authController = require("../controllers/auth.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
    createUserSchema,
    updateUserSchema,
} = require("../schemas/user.schema");
const { createPetSchema, updatePetSchema } = require("../schemas/pet.schema");
const { paginationQuerySchema } = require("../schemas/pagination.schema");

const router = express.Router();
router.use(protect, restrictTo("ADMIN"));

router
    .route("/users")
    .get(validate(paginationQuerySchema), userController.getAllUsers)
    .post(validate(createUserSchema), userController.createUser);

router
    .route("/users/:id")
    .get(userController.getUserById)
    .patch(validate(updateUserSchema), userController.updateUser)
    .delete(userController.deleteUser);

router
    .route("/users/:userId/pets")
    .get(validate(paginationQuerySchema), petController.getAllPets)
    .post(validate(createPetSchema), petController.createPet);

router
    .route("/users/:userId/pets/:petId")
    .get(petController.getPetById)
    .patch(validate(updatePetSchema), petController.updatePet)
    .delete(petController.deletePet);

router.post("/users/:userId/revoke-tokens", authController.banAndRevokeTokens);

module.exports = router;
