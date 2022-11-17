const microcebus_main = artifacts.require("microcebus_main");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("microcebus_main", function (/* accounts */) {
  it("should assert true", async function () {
    await microcebus_main.deployed();
    return assert.isTrue(true);
  });
});
