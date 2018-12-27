# compare-results-visualizer
little UI page which helps to preview screenshots compare results

# Getting Started
* call `yarn`
* call `yarn dev` - to run webpack or `yarn production` in case if you need minimized bundle
* call `yarn serve` to start simple server
* navigate to http://localhost:8081/

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
			"Value": ""
		},
		"TestingFile": {
			"Name": "",
			"Value": ""
		},
		"DiffFile": {
			"Name": "",
			"Value": ""
		}
	}]
}]
```
see `results.json` as an example