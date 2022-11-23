

const get_amount_out = async (contract, amount_in, token0, token1) => {
    const amount = await contract.methods.get_amounts_out(amount_in, token0, token1).call()
    return (amount)
}

const get_max_balance = async (token0, token1, contract, f0, f1, g0, g1) => {
    const max_balance0 = await token0.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    const max_balance1 = await token1.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    if (parseFloat(max_balance0) === 0 || parseFloat(max_balance1) === 0) {
        f0(0)
        f1(0)
        g0(0)
        g1(0)   
    } else {

    const round_balance0 = parseFloat(Math.floor(max_balance0/2)).toString();
    const round_balance1 = parseFloat(Math.floor(max_balance1/2)).toString();

    const amount0 = await contract.methods.get_amounts_out(round_balance0, token0.name, token1.name).call();
    const amount1 = await contract.methods.get_amounts_out(round_balance1, token1.name, token0.name).call();

    if (parseFloat(amount0) <= parseFloat(max_balance1)) {
        f0(round_balance0)
        f1(amount0)
        g0((parseFloat(round_balance0) / (Math.pow(10, token0.decimals))).toFixed(5).toString())
        g1((parseFloat(amount0) / (Math.pow(10, token1.decimals))).toFixed(5).toString())
    } else {
        f0(amount1)
        f1(round_balance1)
        g0((parseFloat(amount1) / (Math.pow(10, token0.decimals))).toFixed(5).toString())
        g1((parseFloat(round_balance1) / (Math.pow(10, token1.decimals))).toFixed(5).toString())  
    }


    }
  }


const get_balance = async (amount_in, token0, token1, contract, f0, f1, g0, g1) => {
    if (parseFloat(amount_in) <= 0) {
        f0(amount_in)
        f1(amount_in)
        g0(amount_in)
        g1(amount_in) 
    } else {
    const round_balance = (parseFloat(amount_in) * Math.pow(10, token0.decimals)).toString();
    const amount = await contract.methods.get_amounts_out(round_balance, token0.name, token1.name).call();
    f0(amount_in * Math.pow(10, token0.decimals))
    f1(amount)
    g0(amount_in)
    g1((parseFloat(amount) / (Math.pow(10, token1.decimals))).toFixed(5).toString())        
  }
}

const approve_token = async (token0, token1, contract, balance0, balance1) => {
    await token0.contract.methods.approve(contract.options.address, balance0).send({
        from: window.ethereum.selectedAddress
     })
     await token1.contract.methods.approve(contract.options.address, balance1).send({
        from: window.ethereum.selectedAddress
     })
    }

const deposit_liquidity = async (token0, token1, contract, balance0, balance1, slippage, deadline) => {
    await approve_token(token0, token1, contract, balance0, balance1)
    const min_amount0 = parseInt(parseInt(balance0) * (1 - slippage)).toString();
    const min_amount1 = parseInt(parseInt(balance1) * (1 - slippage)).toString();
    await contract.methods.add_liquidity(token0.name, token1.name, "300", "300", "10", "10", "10000000000000000").send({
        from: window.ethereum.selectedAddress
     })

}



export {get_amount_out, get_max_balance, approve_token, deposit_liquidity, get_balance}
