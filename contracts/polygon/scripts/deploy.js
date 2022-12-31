(async () => {
  try {
    console.log('deploy...')
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', './build/polygon-contracts/microcebus_main.json'))
    const accounts = await web3.eth.getAccounts()

    let contract = new web3.eth.Contract(metadata.abi)

    await contract.deployed();

    newContractInstance = await contract.send({
      from: accounts[0],
      gas: 1500000,
      gasPrice: '30000000000'
    })
    console.log(newContractInstance.options.address)
  } catch (e) {
    console.log(e.message)
  }
})()