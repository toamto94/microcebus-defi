import React from "react";

export default({farm}) => {
    const approve0 = 'Approve '.concat(farm.token0_name)
    const approve1 = 'Approve '.concat(farm.token1_name)
    return(
        <div className="col">
            <div className='row'>
            <form>
                <input type='button' value={approve0}/>
            </form>
            </div>
            <div className='row'>
            <form>
                <input type='button' value={approve1}/>
            </form>
            </div>
        </div>
    )
}