import React, { UIEventHandler } from 'react';

type NavbarProps = {
    testName: string,
    handleChildClick: any
}

export default class Navbar extends React.Component<NavbarProps>{
    render(){
        return(
            <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar navbar-default history" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li><p className="navbar-text">{this.props.testName}</p></li>
                            </ul>
                            <ul className="nav navbar-nav copy">
                                <li>
                                    <a href="#" id="copyTestName" onClick={this.props.handleChildClick}>
                                        <i id="copyTestName" className="fa fa-clipboard"></i>
                                    </a>
                                </li>
                            </ul>
                            <ul id="toggleList" className="nav navbar-nav navbar-right">
                                <li><a href="#" id="toggleList" onClick={this.props.handleChildClick}><i id="toggleList" className="fa fa-list"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
        )
    }
}