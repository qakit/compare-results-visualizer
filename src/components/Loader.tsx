import React from 'react';

export default class Loader extends React.Component{
    render(){
        return(
            <div className="loader">
                <div className="cssload-loader">
                    <div className="cssload-inner cssload-one"></div>
                    <div className="cssload-inner cssload-two"></div>
                    <div className="cssload-inner cssload-three"></div>
                </div>
            </div>
        )
    }
}