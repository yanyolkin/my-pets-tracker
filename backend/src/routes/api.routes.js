const express = require("express");
const authRouter = require("./auth.routes");
const petRouter = require("./pet.routes");
const adminRouter = require("./admin.routes");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const locationRouter = require("./location.routes");

const router = express.Router();

const swaggerDocument = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use("/auth", authRouter);
router.use("/pets", petRouter);
router.use("/admin", adminRouter);
router.use("/locations", locationRouter);

module.exports = router;
