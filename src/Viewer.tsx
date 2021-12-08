import {render} from 'react-dom';
import React from 'react';
import './styles/App.scss';

import FakeData from './components/FakeData';

import ResultViewer from './components/ResultViewer';

export type TestResult = {
    TestName: string,
    Environment: Environment,
    Artifacts:TestResultArtifact[]
}

export type Environment = {
    Browser: string,
    WindowSize: string
}

export type TestResultArtifact = {
    StableFile: TestResultFileInfo,
    TestingFile: TestResultFileInfo,
    DiffFile: TestResultFileInfo
}

export type TestResultFileInfo = {
    Type: string,
    Name: string,
    Value: string
}

export default class Viewer {
    readonly _hostElement: Element;
    
    constructor(element: any, data: TestResult[]){
        const hostElement: Element | null =
            (typeof element === 'string') ? document.querySelector(element) : 
            (element instanceof Element) ? element : 
            (element && element.jquery) ? element[0]:
            null;
        
        if(hostElement == null) throw new Error(`Can't find host element: ` + element)
        this._hostElement = hostElement;

        //TODO may be throw error??
        if (data == null) data = FakeData;

        render(
            <ResultViewer data={data} ></ResultViewer>            
            , this._hostElement
        )
    }
}