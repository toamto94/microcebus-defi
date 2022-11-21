

const get_amount_out = async (contract, amount_in, token0, token1) => {
    const amount = await contract.methods.get_amounts_out(amount_in, token0, token1).call()
    return (amount)
}

const get_max_balance = async (token0, token1, contract, f0, f1) => {
    const max_balance = await token0.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    const round_balance = parseInt(Math.floor(max_balance/2)).toString();
    const amount = await contract.methods.get_amounts_out(round_balance, token0.name, token1.name).call();
    f0(round_balance)
    f1(amount)
  }


export {get_amount_out, get_max_balance}
