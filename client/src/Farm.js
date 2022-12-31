import React from "react";
import FarmHTML from "./farmHTML";

export default ({farm, contract}) => {
    return(
        <div className="row">
            <div className="col">
                <FarmHTML farm={farm} contract={contract}/>
            </div>
        </div>
    )
}