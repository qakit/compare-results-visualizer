import React, { UIEventHandler } from 'react'
import { TestResultFileInfo } from '../Viewer'

type ImageResultPreviewContainerProps = {
    stableFile: TestResultFileInfo,
    testingFile: TestResultFileInfo,
    scrollEvent: UIEventHandler<HTMLDivElement> | undefined
}

type ImageResultPreviewContainerState = {
    stableFile: TestResultFileInfo,
    testingFile: TestResultFileInfo
}

export default class ImageResultPreviewContainer extends React.Component<ImageResultPreviewContainerProps, ImageResultPreviewContainerState>{
    render(){
        const base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
        const stableImagePrefix = base64Matcher.test(this.props.stableFile.Value) ? "data:image/png;base64," : "";
        const testingImagePrefix = base64Matcher.test(this.props.testingFile.Value) ? "data:image/png;base64," : "";

        return(
            <div className="flexChild rowParent">
                <div id="stableFile" onScroll={this.props.scrollEvent} className="flexChild">
                    <img title="Stable Result" src={`${stableImagePrefix}${this.props.stableFile.Value}`}/>
                </div>
                <div id="testingFile" onScroll={this.props.scrollEvent} className="flexChild">
                    <img title="Testing Result" src={`${testingImagePrefix}${this.props.testingFile.Value}`} />
                </div>
            </div>
        )
    }
}