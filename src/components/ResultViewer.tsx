import React from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import {saveAs} from 'file-saver';
import {TestResult, TestResultArtifact, TestResultFileInfo} from '../Viewer';
import Navbar from './Navbar';
import ImageResultPreviewContainer from './ImageResultPreviewContainer';
import HtmlResultPreviewContainer from './HtmlResultPreviewContainer';
import ControlPanel from './ControlPanel';
import Loader from './Loader';
import TreeViewPanel from './TreeViewPanel';

type ResultViewerProps = {
    data: TestResult[]
}

type ResultViewerState = {
    testData: TestResult[],
    maxTests: number,
    maxTestResults: number,
    testInfo: CurrentTestInfo,
    showDiff: boolean,
    testsTreeViewState: string
}

export type CurrentTestInfo = {
    TestName: string,
    HasDiff: boolean,
    TestIndex: number,
    TestResultIndex: number,
    TestResultFileName: string,
}

export default class ResultViewer extends React.Component<ResultViewerProps, ResultViewerState>{
    constructor(props : ResultViewerProps){
        super(props)

        var artifacts = this.props.data[0].Artifacts;
        var resultFileName = this.getCurrentResultFileName(artifacts[0]);

        this.state = {
            testData: this.props.data,
            maxTestResults: artifacts.length,
            maxTests: this.props.data.length,
            testInfo: {
                TestName: this.props.data[0].TestName,
                HasDiff: artifacts[0].DiffFile.Name !== "",
                TestIndex: 0,
                TestResultIndex: 0,
                TestResultFileName: resultFileName
            },
            showDiff: false,
            testsTreeViewState: "collapsed"
        }
    }

    componentDidMount() {
        document.body.addEventListener('keydown', this.handleKeyDown);
    }
    componenWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
    }

    getCurrentResultFileName(artifact: TestResultArtifact) {
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

    handleChildClick = (event: any) => {
        var {HasDiff: hasDiff, TestIndex: testIndex, TestResultFileName: currentResultName, TestResultIndex: resultFileIndex} = this.state.testInfo 
        var {showDiff, maxTestResults} = this.state;
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
            if (resultFileIndex === (maxTestResults - 1)) return;
            
            resultFileIndex = this.state.testInfo.TestResultIndex + 1;
            showDiff = false;
        }
        if (id === "previousFail") {
            if (resultFileIndex === 0) return;
            resultFileIndex = resultFileIndex - 1;
            showDiff = false
        }
        if (id === "previousTest") {
            if (testIndex === 0) return;

            resultFileIndex = 0;
            showDiff = false;
            testIndex = testIndex - 1;

            maxTestResults = this.state.testData[testIndex].Artifacts.length;
        }
        if (id === "nextTest") {
            if (testIndex === (this.state.maxTests - 1)) return;

            testIndex = testIndex + 1;
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
        if(id === "copyTestName"){
            navigator.clipboard.writeText(this.state.testInfo.TestName);
            return;
        }
        if(id === "downloadTestFiles"){
            let zip = new JSZip();
            
            let artifacts = this.state.testData[testIndex].Artifacts;
            let testName = this.state.testData[testIndex].TestName;
            let count = 0;
            artifacts.forEach(async function(a) {
                var stableFile = await JSZipUtils.getBinaryContent(a.StableFile.Value);
                var testingFile = await JSZipUtils.getBinaryContent(a.TestingFile.Value);
                var diffFile = await JSZipUtils.getBinaryContent(a.DiffFile.Value);

                zip.folder('stable')?.file(a.StableFile.Name, stableFile, {binary: true});
                zip.folder('testing')?.file(a.TestingFile.Name, testingFile, {binary: true});
                zip.folder('diff')?.file(a.DiffFile.Name, diffFile, {binary: true});

                count++;
                if(count === artifacts.length){
                    zip.generateAsync({type: 'blob'}).then(content => {
                        saveAs(content, `${testName}.zip`)
                    });
                }
            })
            
            return;
        }

        currentResultName = this.getCurrentResultFileName(this.state.testData[testIndex].Artifacts[resultFileIndex]);
        hasDiff = this.state.testData[testIndex].Artifacts[resultFileIndex].DiffFile.Name !== "";
        var testName = this.state.testData[testIndex].TestName;

        this.setState({
            testInfo:{
                TestResultIndex: resultFileIndex,
                TestResultFileName: currentResultName,
                TestName: testName,
                HasDiff: hasDiff,
                TestIndex: testIndex
            },
            showDiff: showDiff,
            maxTestResults: maxTestResults
        })
    };

    handleScroll(event: any){
        var current = event.target;
        var otherElement = current.id === "stableFile" ? document.querySelector("#testingFile") : document.querySelector("#stableFile");

        otherElement.scrollTop = current.scrollTop;
        otherElement.scrollLeft = current.scrollLeft;
    }
    handleTestItemClick = (event: any) => {
        var parent = event.target.parentNode;
        var newTestIndex = parseInt(parent.id);
        //no need to do anything
        if(newTestIndex === this.state.testInfo.TestIndex) return;

        var hasDiff = this.state.testData[newTestIndex].Artifacts[0].DiffFile.Name !== "";
        var maxTestResults = this.state.testData[newTestIndex].Artifacts.length;
        var currentResultName = this.getCurrentResultFileName(this.state.testData[newTestIndex].Artifacts[0]);

        this.setState({
            maxTestResults: maxTestResults,
            testInfo: {
                TestIndex: newTestIndex,
                TestResultIndex: 0,
                HasDiff: hasDiff,
                TestName: this.state.testData[newTestIndex].TestName,
                TestResultFileName: currentResultName
            },
            showDiff: false
        });
    };
    handleKeyDown = (event: any) => {
        event.preventDefault();
        //rigth arrow
        if (event.keyCode === 39) {
            this.handleChildClick("nextFail");
            return;
        }
        //left arrow
        if (event.keyCode === 37) {
            this.handleChildClick("previousFail");
            return;
        }
        //up arrow
        if (event.keyCode === 38) {
            this.handleChildClick("previousTest");
            return;
        }
        //down arrow
        if (event.keyCode === 40) {
            this.handleChildClick("nextTest");
            return;
        }
        //space
        if (event.keyCode === 32) {
            this.handleChildClick("showDiff");
            return;
        }
    };

    render(){
        var testInfo = this.state.testInfo;
        var artifacts = this.state.testData[testInfo.TestIndex].Artifacts;

        var noStableObject = {
            Type: "image",
            Name: "",
            Value: ".//images//nostable.png"
        };

        var noTestingObject = {
            Type: "image",
            Name: "",
            Value: ".//images//notesting.png"
        };

        var noDiffObject = {
            Type: "image",
            Name: "",
            Value: ".//images//nodiff.png"
        };
        
        const testingResultFile = this.state.showDiff ?
            (artifacts[testInfo.TestResultIndex].DiffFile.Value === "" ? noDiffObject : artifacts[testInfo.TestResultIndex].DiffFile) :
            (artifacts[testInfo.TestResultIndex].TestingFile.Value === "" ?  noTestingObject : artifacts[testInfo.TestResultIndex].TestingFile);
        const stableResultFile = artifacts[testInfo.TestResultIndex].StableFile.Value === "" ? noStableObject : artifacts[testInfo.TestResultIndex].StableFile;

        const resultType = stableResultFile.Type;
        const environment = this.state.testData[testInfo.TestIndex].Environment;

        const { maxTestResults, showDiff, testData } = this.state;        

        const testItemSelectedClass = function(i: number){
            return testInfo.TestIndex === i && 'selected' || '';
        }

        return(
            <div className="flexChild columnParent preview">
                <Navbar testName={testInfo.TestName} handleChildClick={this.handleChildClick} ></Navbar>
                <div className="flexChild rowParent">
                    {(resultType === "image" || resultType === undefined || resultType === "" || resultType === null) && <ImageResultPreviewContainer stableFile={stableResultFile} testingFile={testingResultFile} scrollEvent={this.handleScroll}/>}
                    {resultType === "html" && <HtmlResultPreviewContainer stableFile={stableResultFile} testingFile={testingResultFile} scrollEvent={this.handleScroll}/>}

                    <TreeViewPanel testData={testData} handleClick={this.handleTestItemClick} state={this.state.testsTreeViewState} testItemSelectedClass={testItemSelectedClass} ></TreeViewPanel>
                </div>
                <ControlPanel environment={environment} testInfo={testInfo} showDiff={showDiff} handleChildClick={this.handleChildClick} maxTestResults={maxTestResults}></ControlPanel>
                {(!this.state.testData) && 
                    <Loader></Loader>
                }
            </div>
        )
    }
}