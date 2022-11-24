

const get_amount_out = async (contract, amount_in, token0, token1) => {
    const amount = await contract.methods.get_amounts_out(amount_in, token0, token1).call()
    return (amount)
}

const get_max_balance = async (token0, token1, contract, f0, f1, g0, g1) => {
    const max_balance0 = await token0.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    const max_balance1 = await token1.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    if (parseInt(max_balance0) === 0 || parseInt(max_balance1) === 0) {
        f0(0)
        f1(0)
        g0(0)
        g1(0)   
    } else {

    const amount0 = await contract.methods.get_amounts_out(max_balance0, token0.name, token1.name).call();
    const amount1 = await contract.methods.get_amounts_out(max_balance1, token1.name, token0.name).call();

    if (parseInt(amount0) <= parseInt(max_balance1)) {
        f0(max_balance0)
        f1(amount0)
        g0((parseInt(max_balance0) / (Math.pow(10, token0.decimals))).toFixed(5).toString())
        g1((parseInt(amount0) / (Math.pow(10, token1.decimals))).toFixed(5).toString())
    } else {
        f0(amount1)
        f1(max_balance1)
        g0((parseInt(amount1) / (Math.pow(10, token0.decimals))).toFixed(5).toString())
        g1((parseInt(max_balance1) / (Math.pow(10, token1.decimals))).toFixed(5).toString())  
    }


    }
  }


const get_balance = async (amount_in, token0, token1, contract, f0, f1, g0, g1, timer, setTimer) => {

    
    if (amount_in > 0) {

        clearTimeout(timer)
    
        const newTimer = setTimeout( async () => {
            const amount_out = await contract.methods.get_amounts_out((amount_in * Math.pow(10, token0.decimals)).toString(), token0.name, token1.name).call();
            f0((amount_in * Math.pow(10, token0.decimals)).toString())
            f1(amount_out)
            g0(amount_in)
            g1((parseInt(amount_out) / (Math.pow(10, token1.decimals))).toFixed(5))   
            
        }, 100)
    
        setTimer(newTimer)
    } else {
        f0(null)
        f1(null)
        g0(null)
        g1(null)  
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

const deposit_liquidity = async (farm, contract, balance0, balance1, slippage, deadline, f, g0, g1) => {
    await approve_token(farm.token0, farm.token1, contract, balance0, balance1)
    const min_amount0 = parseInt(parseFloat(balance0) * (1 - slippage)).toString();
    const min_amount1 = parseInt(parseFloat(balance1) * (1 - slippage)).toString();
    await contract.methods.add_liquidity(farm.token0.name, farm.token1.name, balance0, balance1, min_amount0, min_amount1, deadline).send({
        from: window.ethereum.selectedAddress
     })
     const amount = await contract.methods.get_user_deposit(window.ethereum.selectedAddress, farm.token0.name, farm.token1.name).call()
     f(amount)
}

const withdraw = async (farm, contract, amount, slippage, deadline, f, g) => {     
    await contract.methods.withdraw_liquidity(farm.token0.name, farm.token1.name, amount, "1", "1", deadline).send({
        from: window.ethereum.selectedAddress
     })
    const rest_amount = await contract.methods.get_user_deposit(window.ethereum.selectedAddress, farm.token0.name, farm.token1.name).call()
    f(rest_amount)
    g("0")
}

const withdraw_all = async (farm, contract, slippage, deadline, f, g) => {
    const max_amount = await contract.methods.get_user_deposit(window.ethereum.selectedAddress, farm.token0.name, farm.token1.name).call()
    withdraw(farm, contract, max_amount, slippage, deadline, f)
}

export {get_amount_out, get_max_balance, approve_token, deposit_liquidity, get_balance, withdraw, withdraw_all}
