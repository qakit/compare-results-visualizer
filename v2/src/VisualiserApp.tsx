import React from 'react'
import './App.scss';
import ImageResultPreviewContainer from './ImageResultPreviewContainer';
import $ from 'jquery';
import HtmlResultPreviewContainer from './HtmlResultPreviewContainer';

type AppProps = {};
type AppState = { 
    testData: TestResult[],
    maxTestResults: number,
    resultFileName: string,
    maxTests: number,
    showDiff: boolean,
    hasDiff: boolean,
    testIndex: number,
    testResultFileIndex: number,
    testsTreeViewState: string
}

type TestResult = {
    TestName: string,
    Environment: {
        Browser: string,
        WindowSize: string
    },
    Artifacts:{
        StableFile: TestResultFileInfo,
        TestingFile: TestResultFileInfo,
        DiffFile: TestResultFileInfo
    }[]
}

export type TestResultFileInfo = {
    Type: string,
    Name: string,
    Value: string
}

var fakePreviewData = [{
	"TestName": "",
	"Environment": {
		"Id": 0,
		"Browser": "",
		"WindowSize": ""
	},
	"Artifacts": [{
		"StableFile": {
            "Type": "image",
			"Name": "",
			"Value": ""
		},
		"TestingFile": {
            "Type": "image",
			"Name": "",
			"Value": ""
		},
		"DiffFile": {
            "Type": "image",
			"Name": "",
			"Value": ""
		}
	}]
}]

export default class VisualiserApp extends React.Component<AppProps, AppState>{
    constructor(props: AppProps){
        super(props);
        this.state = this.getInitialState();
    }

    componentDidMount(){
        this.getData();
    }
    getCurrentResultFileName(artifact: any) {
        if (artifact.TestingFile.Name !== "") {
            return artifact.TestingFile.Name;
        }
        if (artifact.StableFile.Name !== "") {
            return artifact.StableFile.Name;
        }
        if (artifact.DiffFile.Name !== "") {
            return artifact.DiffFile.Name;
        }
        return "";
    }
    getInitialState() {
        var fakeData = fakePreviewData;
        
        var artifacts = fakeData[0].Artifacts;
        var resultFileName = this.getCurrentResultFileName(artifacts[0]);
        var maxResults = artifacts.length;
        var maxTests = fakeData.length;
        var hasDiff = artifacts[0].DiffFile.Name !== "";
        
        return ({
            //index of the test in current fails
            testIndex: 0,
            //result file index in the current test
            testResultFileIndex: 0,
            //max images count
            maxTestResults: maxResults,
            maxTests: maxTests,
            resultFileName: resultFileName,
            //show diff image instead of stable or not
            showDiff: false,
            hasDiff: hasDiff,
            testData: fakeData,
            testsTreeViewState: "collapsed"
        });
    }
    getData(testIndex: number = 0, resultIndex: number = 0){
        fetch('./results.json')
            .then(response => response.json())
            .then((json: TestResult[] )=> {
                
                var artifacts = json[testIndex].Artifacts;
                var resultFileName = this.getCurrentResultFileName(artifacts[resultIndex]);
                var hasDiff = artifacts[resultIndex].DiffFile.Name !== "";

                this.setState({
                    testData: json,
                    maxTestResults: artifacts.length,
                    resultFileName: resultFileName,
                    maxTests: json.length,
                    showDiff: false,
                    hasDiff: hasDiff,
                    testIndex: testIndex,
                    testResultFileIndex: resultIndex
                })
        })
    }

    getIntitialState(){
        
    }
    handleChildClick = (event: any) => {
        var resultFileIndex = this.state.testResultFileIndex;
        var showDiff = this.state.showDiff;
        var hasDiff = this.state.hasDiff;
        var testIndex = this.state.testIndex;
        var currentResultName = this.state.resultFileName;
        var maxTestResults = this.state.maxTestResults;
        var id;

        if (typeof event === "string") {
            id = event;
        } else {
            id = event.target.id;
        }

        if (id === "showDiff" && hasDiff) {
            showDiff = !this.state.showDiff;
        }
        if (id === "nextFail") {
            if (this.state.testResultFileIndex === (this.state.maxTestResults - 1)) return;
            
            resultFileIndex = this.state.testResultFileIndex + 1;
            showDiff = false;
        }
        if (id === "previousFail") {
            if (this.state.testResultFileIndex === 0) return;
            resultFileIndex = this.state.testResultFileIndex - 1;
            showDiff = false
        }
        if (id === "previousTest") {
            if (this.state.testIndex === 0) return;

            resultFileIndex = 0;
            showDiff = false;
            testIndex = this.state.testIndex - 1;

            maxTestResults = this.state.testData[testIndex].Artifacts.length;
        }
        if (id === "nextTest") {
            if (this.state.testIndex === (this.state.maxTests - 1)) return;

            testIndex = this.state.testIndex + 1;
            resultFileIndex = 0;
            showDiff = false;
            
            maxTestResults = this.state.testData[testIndex].Artifacts.length;
        }
        if (id === "toggleList") {
            var newPanelState = this.state.testsTreeViewState === "collapsed" ? '' : 'collapsed'
            this.setState({
                testsTreeViewState: newPanelState
            });
            return;
        }

        currentResultName = this.getCurrentResultFileName(this.state.testData[testIndex].Artifacts[resultFileIndex]);
        hasDiff = this.state.testData[testIndex].Artifacts[resultFileIndex].DiffFile.Name !== "";

        this.setState({
            testResultFileIndex: resultFileIndex,
            showDiff: showDiff,
            hasDiff: hasDiff,
            testIndex: testIndex,
            resultFileName: currentResultName,
            maxTestResults: maxTestResults
        })
    };
    handleScroll(event: any){
        var current = event.target;
        var otherElement = current.id === "leftImage" ? $("#rightImage") : $("#leftImage");
        var other = otherElement[0];

        other.scrollTop = current.scrollTop;
        other.scrollLeft = current.scrollLeft;
    }
    handleTestItemClick = (event: any) => {
        var parent = event.target.parentNode;

        this.setState({
            testIndex: parseInt(parent.id),
            testResultFileIndex: 0
        });
    };
    render(){
        const {TestName: testName, Artifacts: artifacts } = this.state.testData[this.state.testIndex];
        const testingResultFile = this.state.showDiff ? artifacts[this.state.testResultFileIndex].DiffFile : artifacts[this.state.testResultFileIndex].TestingFile;
        const stableResultFile = artifacts[this.state.testResultFileIndex].StableFile;
        const resultType = stableResultFile.Type;
        const {Browser: browser, WindowSize: windowSize} = this.state.testData[this.state.testIndex].Environment;
        const imageName = this.state.resultFileName;

        const { testResultFileIndex, maxTestResults, hasDiff, showDiff, testData, testIndex } = this.state;        
        const diffClass = hasDiff ? 'enabled' : 'disabled';
        const diffIconClass = showDiff ? "fa fa-eye-slash" : "fa fa-eye";
        const testItemSelectedClass = function(i: number){
            return testIndex === i && 'selected' || '';
        }

        var browserImage = "";
        switch(browser){
            case "chrome":
                browserImage = "chrome.png";
                break;
            case "firefox":
                browserImage = "firefox.png";
                break;
            case "ie":
                browserImage = "ie.png";
                break;
            default:
                browserImage = "chrome.png";
                break;            
        }
        var browserTypeIconPath = `.//images//${browserImage}`;

        return (
            <div className="flexChild columnParent preview"> 
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar navbar-default history" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li><p className="navbar-text">{testName}</p></li>
                            </ul>
                            <ul id="toggleList" className="nav navbar-nav navbar-right">
                                <li><a href="#" id="toggleList" onClick={this.handleChildClick}><i id="toggleList" className="fa fa-list"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="flexChild rowParent">
                    {resultType === "image" && <ImageResultPreviewContainer stableFile={stableResultFile} testingFile={testingResultFile} scrollEvent={this.handleScroll}/>}
                    {resultType === "html" && <HtmlResultPreviewContainer stableFile={stableResultFile} testingFile={testingResultFile} scrollEvent={this.handleScroll}/>}
                    
                    <div className={`strange-panel ${this.state.testsTreeViewState} `}>
                        {(testData && testData[0].TestName !== "") && testData.map((data, i) =>
                         <a key={`${data.TestName} - ${data.Environment.Browser}|${data.Environment.WindowSize}`} href="#" onClick={this.handleTestItemClick} id={`${parseInt(`${i}`)}`} className={`${testItemSelectedClass(i)}`}>
                            <span>{(i+1)}</span>
                            <span>{data.TestName}</span></a>)}
                    </div>                    
                </div>
                <div className="control-panel">
                    <span className="info">
                        <span title={imageName}>{imageName}</span>
                        <span>
                            <span><i className="browserType" style={{backgroundImage: `url(${browserTypeIconPath})`}}></i></span>
                            <span>{windowSize}</span>
                        </span>
                    </span>
                    <a href="#" id="previousTest" onClick={this.handleChildClick}><i id="previousTest" className="fa fa-step-backward"></i></a>
                    <a href="#" id="previousFail" onClick={this.handleChildClick}><i id="previousFail" className="fa fa-backward"></i></a>
                    <span>{`${testResultFileIndex + 1} / ${maxTestResults}`}</span>
                    <a href="#" id="nextFail" onClick={this.handleChildClick}><i id="nextFail" className="fa fa-forward"></i></a>
                    <a href="#" id="nextTest" onClick={this.handleChildClick}><i id="nextTest" className="fa fa-step-forward"></i></a>
                    <div></div>
                    <a href="#" id="showDiff" className={diffClass} onClick={this.handleChildClick}><i id="showDiff" className={diffIconClass}></i></a>                    
                </div>
                {(!this.state.testData) && <div className="loader">
                    <div className="cssload-loader">
                        <div className="cssload-inner cssload-one"></div>
                        <div className="cssload-inner cssload-two"></div>
                        <div className="cssload-inner cssload-three"></div>
                    </div>
                </div>}
            </div>)
    }
}