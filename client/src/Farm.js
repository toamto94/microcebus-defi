import React from "react";
import ApproveButton from "./approveButton";

export default({farm}) => {
    return(
        <div className="row">
            <div className="col">
                <ApproveButton farm={farm} />
            </div>
            <div className="col">
                <ApproveButton farm={farm} />
            </div>
        </div>
    )
}