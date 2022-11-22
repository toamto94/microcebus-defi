import React, { useState } from "react";
import { get_amount_out, get_max_balance, approve_token } from "./contractFunctions";

export default ({farm, contract}) => {

    const [balance0, setBalance0] = useState(0);
    const [balance1, setBalance1] = useState(0);

    const approve0 = 'Approve '.concat(farm.token0.name)
    const approve1 = 'Approve '.concat(farm.token1.name)

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
                        <textarea value={(parseInt(balance0) / (Math.pow(10, farm.token0.decimals))).toString()}/>
                    </form>
                </div>

                <div className="col">
                    <form onClick={() => get_max_balance(farm.token0, farm.token1, contract, setBalance0, setBalance1)}>
                        <input type='button' value='max' />
                    </form>
                </div>
                <div className='col'>
                    <form>
                        <input type='button' value='Deposit' />
                    </form>
                </div>
                <div className="col">
                    <div className="row">
                        Current Deposit: 
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
                        <textarea value={(parseInt(balance1) / (Math.pow(10, farm.token1.decimals))).toString()}/>
                    </form>
                </div>

                <div className="col">
                    <form onClick={() => get_max_balance(farm.token1, farm.token0, contract, setBalance1, setBalance0)}>
                        <input type='button' value='max' />
                    </form>
                </div>
                <div className='col'>
                    <div className="row">
                        <form>
                            <input type='button' value='Withdraw' />
                        </form>
                        <form>
                            <textarea value="0"/>
                        </form>
                    </div>
                    <div className="row">
                        <form>
                            <input type='button' value='Withdraw All' />
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
