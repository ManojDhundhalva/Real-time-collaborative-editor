const { Router } = require("express");
const controller = require("../controllers/project");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyUser");

const router = Router();

router.get(
  "/get-all-projects",
  verifyTokenAndAuthorization,
  controller.getAllProjects
);
router.post("/add-project", verifyTokenAndAuthorization, controller.addProject);
router.get("/get-all-files", verifyTokenAndAuthorization, controller.getAllFiles);
router.post("/create-a-new-file", verifyTokenAndAuthorization, controller.createANewFile);
router.get("/get-project-name", verifyTokenAndAuthorization, controller.getProjectName);
router.post("/add-contributor", verifyTokenAndAuthorization, controller.addContributor);
router.get("/get-all-active-files", verifyTokenAndAuthorization, controller.getAllActiveFiles);
router.get("/get-file-tree", verifyTokenAndAuthorization, controller.getFileTree);



module.exports = router;