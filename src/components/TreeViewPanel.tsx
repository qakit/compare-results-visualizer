import React, { MouseEventHandler } from 'react';
import { TestResult } from '../Viewer';

type TreeViewPanelProps = {
    testData: TestResult[],
    state: string,
    handleClick: MouseEventHandler<HTMLAnchorElement> | undefined,
    testItemSelectedClass: (x: number) => string
}

export default class TreeViewPanel extends React.Component<TreeViewPanelProps>{
    render(){
        var testData = this.props.testData;
        var panelState = this.props.state;
        var handleTestItemClick = this.props.handleClick;
        var testItemSelectedClass = this.props.testItemSelectedClass;

        return(
            <div className={`strange-panel ${panelState} `}>
                {(testData && testData[0].TestName !== "") && testData.map((data, i) =>
                    <a key={`${data.TestName} - ${data.Environment.Browser}|${data.Environment.WindowSize}`} href="#" onClick={handleTestItemClick} id={`${parseInt(`${i}`)}`} className={`${testItemSelectedClass(i)}`}>
                    <span>{(i+1)}</span>
                    <span>{data.TestName}</span></a>)}
            </div>  
        )
    }
}