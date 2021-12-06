import { stat } from 'fs';
import React, { UIEventHandler } from 'react'
import { TestResultFileInfo } from './VisualiserApp'

type HtmlResultPreviewContainerProps = {
    stableFile: TestResultFileInfo,
    testingFile: TestResultFileInfo,
    scrollEvent: UIEventHandler<HTMLDivElement> | undefined
}

type HtmlResultPreviewContainerState = {
    stableFileContentValue: string,
    testingFileContentValue: string,
    stableFileContent: string,
    testingFileContent: string
}

export default class HtmlResultPreviewContainer extends React.Component<HtmlResultPreviewContainerProps, HtmlResultPreviewContainerState>{
    constructor(props: HtmlResultPreviewContainerProps){
        console.log('CTR of HTML');
        super(props);
        this.state = {
            stableFileContentValue: "",
            testingFileContentValue: "",
            stableFileContent: "",
            testingFileContent: ""
        }
    }

    static getDerivedStateFromProps(props: HtmlResultPreviewContainerProps, state: HtmlResultPreviewContainerState){
        if(props.stableFile.Value !== state.stableFileContentValue){
            return{
                stableFileContentValue: props.stableFile.Value,
                testingFileContentValue: props.testingFile.Value,
                stableFileContent: "",
                testingFileContent: ""
            }
        }
        return null;
    }

    componentDidMount(){
        this._loadDataAsync(this.props);
    }

    componentDidUpdate(prevProps: HtmlResultPreviewContainerProps, prevState: HtmlResultPreviewContainerState){
        if(this.state.stableFileContent === ""){
            this._loadDataAsync(this.props);
        }
    }

    _loadDataAsync(props: HtmlResultPreviewContainerProps){
        fetch(props.stableFile.Value)
            .then(response => response.text())
            .then(data => this.setState({stableFileContent: data}))
        fetch(props.testingFile.Value)
            .then(response => response.text())
            .then(data => this.setState({testingFileContent: data}))
    }

    render(){
        return(
            <div className="flexChild rowParent">
                <div id="leftImage" onScroll={this.props.scrollEvent} className="flexChild" dangerouslySetInnerHTML={{__html: this.state.stableFileContent }}>
                </div>
                <div id="rightImage" onScroll={this.props.scrollEvent} className="flexChild" dangerouslySetInnerHTML={{__html: this.state.testingFileContent }}>
                </div>
            </div>
        )
    }
}