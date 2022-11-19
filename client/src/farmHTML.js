import React, { useState } from "react";

export default ({farm}) => {

    const [balance0, setBalance0] = useState(0);
    const [balance1, setBalance1] = useState(0);

    const get_balance = async (token, f) => {
        const balance = await token.contract.methods.balanceOf("0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270").call();
        f(balance)
    }

    const approve0 = 'Approve '.concat(farm.token0.name)
    const approve1 = 'Approve '.concat(farm.token1.name)

    return(
        <div className="col">
            
            <div className='row'>

                <div className='col'>
                    <form>
                        <input type='button' value={approve0}/>
                    </form>
                </div>

                <div className='col'>
                    <form>
                        <textarea value={balance0}/>
                    </form>
                </div>

                <div className="col">
                    <form onClick={() => get_balance(farm.token0, setBalance0)}>
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
                        <textarea value={balance1}/>
                    </form>
                </div>

                <div className="col">
                    <form onClick={() => get_balance(farm.token1, setBalance1)}>
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
