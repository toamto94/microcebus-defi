const Microcebus = artifacts.require("microcebus_main");

module.exports = function(_deployer) {
  _deployer.deploy(Microcebus);
};
