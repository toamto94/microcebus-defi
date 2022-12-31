import React, { useState, useEffect, useRef } from "react";
import { get_amount_out, get_max_balance, approve_token, deposit_liquidity, get_balance,
    withdraw, withdraw_all } from "./contractFunctions";

export default ({farm, contract}) => {

    const [balance0, setBalance0] = useState(0);
    const [balance1, setBalance1] = useState(0);
    const [displayBalance0, setDisplayBalance0] = useState(0);
    const [displayBalance1, setDisplayBalance1] = useState(0);
    const [slippage, setSlippage] = useState(0.2);
    const [deadline, setDeadline] = useState("10000000000000000");
    const [currentDeposit, setCurrentDeposit] = useState(0);
    const [timer, setTimer] = useState(null)
    const [withdrawAmount, setWithdrawAmount] = useState(0)
    const [inpu, setInpu] = useState(0)


    const approve0 = 'Approve '.concat(farm.token0.name)
    const approve1 = 'Approve '.concat(farm.token1.name)

    useEffect(() => {
        const init = async () => {
            const amount = await contract.methods.get_user_deposit(window.ethereum.selectedAddress, farm.token0.name, farm.token1.name).call()
            setCurrentDeposit(amount)
        };
        init();
      }, [contract.methods, farm.decimals, farm.token0, farm.token1]);
 

    

    return(
        <div className="col">
            
            <div className='row'>

                <div className='col'>
                    <form onClick={() => approve_token(farm.token0, contract, "200")}>
                        <input type='button' value={approve0}/>
                    </form>
                </div>

                <div className='col'>
                    <form>
                        <input type="number" value={displayBalance0} onChange={ e => get_balance(e.target.value, farm.token0, farm.token1, contract,
                            setBalance0, setBalance1, setDisplayBalance0, setDisplayBalance1, timer, setTimer)}/>
                    </form>
                </div>

                <div className="col">
                    <form onClick={() => get_max_balance(farm.token0, farm.token1, contract, setBalance0, setBalance1, setDisplayBalance0, setDisplayBalance1)}>
                        <input type='button' value='max' />
                    </form>
                </div>
                <div className='col'>
                    <form onClick={() => deposit_liquidity(farm, contract, balance0, balance1, slippage, deadline, setCurrentDeposit)}>
                        <input type='button' value='Deposit' />
                    </form>
                </div>
                <div className="col">
                    <div className="row">
                        Current Deposit: {(currentDeposit / Math.pow(10, farm.decimals)).toFixed(4)}
                    </div>
                    <div className="row">
                        Compounding reward LP
                    </div>
                    <div className="row">
                        Reward: 
                    </div>
                </div>




            </div>

            <div className='row'>
                <div className='col'>
                    <form>
                        <input type='button' value={approve1}/>
                    </form>
                </div>
                <div className='col'>
                    <form>
                        <input value={displayBalance1} type='number' onChange={(e) =>  get_balance(e.target.value, farm.token1, farm.token0, contract,
                            setBalance1, setBalance0, setDisplayBalance1, setDisplayBalance0, timer, setTimer)}/>
                    </form>
                </div>

                <div className="col">
                    {inpu}
                </div>
                <div className='col'>
                    <div className="row">
                        <form>
                            <input type='button' value='Withdraw' onClick={() => withdraw(farm, contract, withdrawAmount,
                                 slippage, deadline, setCurrentDeposit, setWithdrawAmount)}/>
                        </form>
                        <form>
                            <input onChange={e => setWithdrawAmount((e.target.value * Math.pow(10, farm.decimals)).toString())}/>
                        </form>
                    </div>
                    <div className="row">
                        <form>
                            <input type='button' value='Withdraw All' onClick={() => withdraw_all(farm, contract, slippage, deadline, setCurrentDeposit)} />
                        </form>
                    </div>
                </div>
                <div className="col">
                    <form>
                        <input type='button' value='Harvest' />
                    </form>
                </div>

            </div>
        </div>
    )
}
