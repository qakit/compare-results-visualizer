import React, { MouseEventHandler, UIEventHandler } from 'react';
import { Environment, TestResultFileInfo,  } from '../Viewer';
import { CurrentTestInfo } from './ResultViewer';

//TODO too much data here
type ControlPanelProps = {
    environment: Environment,
    testInfo: CurrentTestInfo
    handleChildClick: MouseEventHandler<HTMLAnchorElement> | undefined,
    showDiff: boolean,
    maxTestResults: number
}

export default class ControlPanel extends React.Component<ControlPanelProps>{
    render(){
        var testResultFileName = this.props.testInfo.TestResultFileName;
        var browserIconPath = `.//images/${this.props.environment.Browser}.png`;
        var handleClick = this.props.handleChildClick;

        const diffClass = this.props.testInfo.HasDiff ? 'enabled' : 'disabled';
        const diffIconClass = this.props.showDiff ? "fa fa-eye-slash" : "fa fa-eye";

        return(
            <div className="control-panel">
                <span className="info">
                    <span title={testResultFileName}>{testResultFileName}</span>
                    <span>
                        <span><i className="browserType" style={{backgroundImage: `url(${browserIconPath})`}}></i></span>
                        <span>{this.props.environment.WindowSize}</span>
                    </span>
                </span>
                <a href="#" title="Go to Previos Test (&#x2191;)" id="previousTest" onClick={handleClick}><i id="previousTest" className="fa fa-step-backward"></i></a>
                <a href="#" title="Go to Previous Fail (&#x2190;)" id="previousFail" onClick={handleClick}><i id="previousFail" className="fa fa-backward"></i></a>
                <span>{`${this.props.testInfo.TestResultIndex + 1} / ${this.props.maxTestResults}`}</span>
                <a href="#" title="Go to Next Fail (&#x2192;)" id="nextFail" onClick={handleClick}><i id="nextFail" className="fa fa-forward"></i></a>
                <a href="#" title="Go to Next Test (&#x2193;)" id="nextTest" onClick={handleClick}><i id="nextTest" className="fa fa-step-forward"></i></a>
                <div></div>
                <a href="#" title="Show Diff (Space Bar)" id="showDiff" className={diffClass} onClick={handleClick}><i id="showDiff" className={diffIconClass}></i></a> 
                <div></div>
                <a href="#" title="Download" id="downloadTestFiles" className='enabled' onClick={handleClick}><i id="downloadTestFiles" className='fa fa-download'></i></a>                   
            </div>
        )
    }
}