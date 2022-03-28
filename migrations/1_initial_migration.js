const Migrations = artifacts.require("Migrations");
const TasksContract = artifacts.require("TasksContract");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(TasksContract);
};
