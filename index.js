import React from 'react'
import { render } from 'react-dom'
import ResultsPreviewContent from './modules/ResultsPreviewContent'
require("./styles.scss")

function renderApplication(data, node){
    render(<ResultsPreviewContent testData={data} />, node);
}

window.renderApp = renderApplication;