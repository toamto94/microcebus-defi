import React from "react";
import ApproveButton from "./approveButton";
import TokenInput from "./tokenInput";
import MaxButton from "./maxButton";
import DepositWithdraw from "./depositWithdraw";
import FundMonitoring from "./fundMonitoring";

export default ({farm}) => {
    return(
        <div className="row">

            <div className="col">
                <ApproveButton farm={farm} />
            </div>

            <div className="col">
                <TokenInput />
            </div>

            <div className="col">
                <MaxButton />
            </div>
            
            <div className='col'>
                <DepositWithdraw />
            </div>

            <div className='col'>
                <FundMonitoring />
            </div>


        </div>
    )
}