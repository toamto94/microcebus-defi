import React from "react";
import FarmHTML from "./farmHTML";

export default ({farm}) => {
    return(
        <div className="row">
            <div className="col">
                <FarmHTML farm={farm}/>
            </div>
        </div>
    )
}