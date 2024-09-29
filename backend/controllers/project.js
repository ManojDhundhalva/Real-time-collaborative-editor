const pool = require("../db");
const queries = require("../queries/project");
const { v4: uuidv4 } = require("uuid");

const getAllProjects = async (req, resp) => {
  try {
    if (!req.user || !req.user.id) {
      return resp.status(401).json({ message: "Unauthorized" });
    }
    const results = await pool.query(queries.getAllProjects, [req.user.id]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addProject = async (req, resp) => {
  const { projectName } = req.body;

  if (!projectName) {
    return resp.status(400).json({ message: "Project name is required" });
  }

  try {
    const uniqueId = uuidv4();
    const results1 = await pool.query(queries.addProjects, [
      uniqueId,
      req.user.username,
      projectName,
    ]);
    const results2 = await pool.query(queries.addProjectOwners, [
      uniqueId,
      req.user.id,
    ]);

    const uniqueIdFileTree = uuidv4();
    const results3 = await pool.query(queries.addFileTree, [
      uniqueIdFileTree,
      uniqueId,
      null,
      projectName,
      true,
    ]);

    // const results4 = await pool.query(queries.addFileTreeUser, [
    //   req.user.id,
    //   uniqueIdFileTree,
    //   false,
    // ]);

    resp
      .status(200)
      .json({ project_id: uniqueId, message: "Project added successfully" });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllFiles = async (req, resp) => {
  if (!req.query.projectId) {
    return resp.status(400).json({ message: "Project ID is required" });
  }

  try {
    await pool.query(queries.makeAllActiveFilesToLive, [req.query.username]);

    const results = await pool.query(queries.getAllFiles, [
      req.query.projectId,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const createANewFile = async (req, resp) => {
  const { newFile, extension, projectId } = req.body;

  if (!newFile) {
    return resp.status(400).json({ message: "newFile name is required" });
  }

  try {
    const uniqueId = uuidv4();
    const results = await pool.query(queries.createANewFile, [
      uniqueId,
      projectId,
      req.user.username,
      newFile,
      extension,
    ]);

    resp.status(200).json({ message: "File Created Successfully" });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getProjectName = async (req, resp) => {
  try {
    const results = await pool.query(queries.getProjectName, [
      req.query.projectId,
    ]);

    resp.status(200).json({ project_name: results.rows[0].project_name });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addContributor = async (req, resp) => {
  const { projectId, contributor } = req.body;
  try {
    const results1 = await pool.query(queries.getContributorId, [contributor]);

    const contributorId = results1.rows[0].id;
    const results2 = await pool.query(queries.addContributor, [
      projectId,
      contributorId,
    ]);

    resp.status(200).json({ message: "Added contributor" });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllActiveFiles = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllActiveFiles, [
      req.user.username,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getFileTree = async (req, resp) => {
  try {
    const results = await pool.query(queries.getFileTree, [
      req.query.projectId,
      req.user.id,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getInitialTabs = async (req, resp) => {
  try {
    await pool.query(queries.setAllFilesLive, [
      req.user.username,
      req.query.projectId,
    ]);

    const results = await pool.query(queries.getInitialTabs, [
      req.user.username,
      req.query.projectId,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getLiveUsers = async (req, resp) => {
  try {
    const results = await pool.query(queries.getLiveUsers, [
      req.query.projectId,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const setExpandData = async (req, resp) => {
  const { file_tree_id, expand } = req.body;
  if (expand) {
    try {
      await pool.query(queries.insertExpandData, [req.user.id, file_tree_id]);

      resp.status(200).json({ message: "Update expand" });
    } catch (err) {
      console.error("Error ->", err);
      resp.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    try {
      await pool.query(queries.deleteExpandData, [req.user.id, file_tree_id]);

      resp.status(200).json({ message: "DELETED expand" });
    } catch (err) {
      console.error("Error ->", err);
      resp.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  getAllProjects,
  addProject,
  getAllFiles,
  createANewFile,
  getProjectName,
  addContributor,
  getAllActiveFiles,
  getFileTree,
  getInitialTabs,
  getLiveUsers,
  setExpandData,
};
