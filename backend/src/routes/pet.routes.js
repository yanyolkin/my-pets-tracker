const { Router } = require("express");
const petController = require("../controllers/pet.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createPetSchema, updatePetSchema } = require("../schemas/pet.schema");
const { paginationQuerySchema } = require("../schemas/pagination.schema");

const router = Router();

router.use(protect);

router
    .route("/")
    .get(validate(paginationQuerySchema), petController.getAllPets)
    .post(validate(createPetSchema), petController.createPet);

router
    .route("/:petId")
    .get(petController.getPetById)
    .patch(validate(updatePetSchema), petController.updatePet)
    .delete(petController.deletePet);

module.exports = router;
