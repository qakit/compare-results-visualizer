# compare-results-visualizer [![Build Status](https://travis-ci.com/qakit/compare-results-visualizer.svg?branch=master)](https://travis-ci.com/qakit/compare-results-visualizer)
little UI page which helps to preview screenshots compare results

# Getting Started
* call `yarn`
* call `yarn start` - to run webpack 
* call `yarn build` - in case if you need create production bundle (result see in build folder)
* navigate to http://localhost:4000/

You should see:

![alt text](https://github.com/qakit/compare-results-visualizer/blob/master/compare.PNG "Example of Preview")

## How it works
To make it work for your tests prepare following json in tests

```javascript
[{
	"TestName": "",
	"Environment": {
		"Browser": "",
		"WindowSize": ""
	},
	"Artifacts": [{
		"StableFile": {
			"Name": "",
			"Value": "",
			"Type": "image"
		},
		"TestingFile": {
			"Name": "",
			"Value": "",
			"Type": "image"
		},
		"DiffFile": {
			"Name": "",
			"Value": "",
			"Type": "image"
		}
	}]
}]
```
see `results.json` as an example
