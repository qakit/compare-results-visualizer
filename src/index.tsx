import Viewer from './Viewer';

const root: any = window || global;
if(root){
    root['@qakit/result-viewer'] = Viewer;
}