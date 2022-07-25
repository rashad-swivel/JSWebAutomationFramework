
const https = require('https');
const fs = require('fs');

const host = 'vendorpanel.visualstudio.com';
const basePath = '/Nimblex%20CORE%20Products';

const pat = '';

const testPlanName = 'Procurement Home';
const baseTestSuiteName = 'Procurement Home';

const http = async (method, path, data, mimeType) => {
	return new Promise(
		(resolve, reject) => {
			console.log(`${method} to https://${host}${basePath}/${path}`);
			
			const options = {
				host: host,
				port: 443,
				path: `${basePath}/${path}`,
				method: method.toUpperCase(),
				headers: {
					"Content-Type": mimeType ? mimeType : "application/json"
				},
				auth: ':' + pat
			};
			
			const req = https.request(options, resp => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});
				
				resp.on('error', err => {
					console.log('Error:', err);
					reject(err);
				});

				resp.on('end', () => {
					if (resp.statusCode >= 400) {
						console.log(data)
						reject(`Http Status: ${resp.statusCode}`);
						return;
					}
					
					try {
						const parsed = JSON.parse(data);
						//console.log('Data: ',data);
						resolve(parsed);
					} catch(ex) {
						//console.error('Failed to parse, ', data);
						reject(ex);
					}
				});
			});
			if(data){
				req.write(JSON.stringify(data));
			}
			req.end();
		}
	);
}

function find(array, callback){
	for(let i = 0; i < array.length; ++i){
		if(callback(array[i])) {
			return array[i];
		}
	}
	
	return undefined;
}

async function findTestPlan(name) {
    const testPlanIdRes = await http('GET', '_apis/test/plans?api-version=5.0');
	
	const match = find(testPlanIdRes.value, item => item.name == name);
	
	if (!match)
	{
		return undefined;
	}
	
	return match.id;
}

async function findTestSuiteId(testPlanId, name) {
    const result = await http('GET', `_apis/test/plans/${testPlanId}/suites?api-version=5.0`);
	
	let match = find(result.value, item => item.name == name);
	
	if (!match)
	{
		return undefined;
	}
	
	return match.id;
}

async function getExistingSuitesByName(testPlanId) {
    const raw = await http('GET', `_apis/test/plans/${testPlanId}/suites?api-version=5.0`);
	
	const res = {};
	
	raw.value.forEach(
		item => {
			res[item.name] = item.id
		}
	);
	
	return res;
}

async function getExistingTestCasesByName(testPlanId, testSuiteId) {
    const raw = await http('GET', `_apis/test/plans/${testPlanId}/suites/${testSuiteId}/TestCases?api-version=5.0`);
	
	const workitemids = [];
	
	raw.value.forEach(
		item => {
			workitemids.push(item.testCase.id);
		}
	);
	
	if (workitemids.length == 0){
		return {};
	}
	
	const workItemSearch = {
		"ids": workitemids
	};
	
	const workItemResult = await http('POST', `_apis/wit/workitemsbatch?api-version=5.0`, workItemSearch);
	
	const result = {};
	
	for(let i = 0; i < workItemResult.value.length; ++i) {
		let current = workItemResult.value[i];
		
		result[current.fields["System.Title"]] = current.id;
	}
	
	return result;
}

async function createTestSuite(testPlanId, parentSuiteId, name) {
	const content = {
		name: name,
		suiteType: 'StaticTestSuite'
	};
	
    const result = await http('POST', `_apis/test/plans/${testPlanId}/suites/${parentSuiteId}?api-version=5.0`, content);
	
	const id = result.value[0].id;
	
	return id;
}

async function createTestCase(testPlanId, testSuiteId, name) {
	const content = [
		{
			"op": 'add',
			"path": '/fields/System.Title',
			"value": name
		}
	];
	
    const creationResult = await http('POST', `_apis/wit/workitems/$Test%20Case?api-version=5.0`, content, 'application/json-patch+json');
	
	const id = creationResult.id;
	
	const assignResult = await http('POST', `_apis/test/Plans/${testPlanId}/suites/${testSuiteId}/testcases/${id}?api-version=5.0`);
	
	return id;
}

function didAllPass(steps){
	let pass = true;
	
	for (let i = 0; i < steps.length; ++i){
		let step = steps[i];
		
		if (step.result.status != 'passed') {
			pass = false;
		}
	}
	
	return pass;
}

async function getTestPointForCase(testPlanId, testSuiteId, testCaseId) {
    const testPointIdRes = await http('GET', `_apis/test/plans/${testPlanId}/suites/${testSuiteId}/points?testCaseId=${testCaseId}&api-version=5.0`);
    
    const testPointId = testPointIdRes.value[0].id;
	
	return testPointId;
}

async function createTestRun(testPlanId, pointIds, name) {
    const testRun = {
        "name": name,
        "plan": { "id": testPlanId }, 
		"pointIds": pointIds
    };
	
    const testRunRes = await http('POST', `_apis/test/runs?api-version=5.0`, testRun);
    	
    const testRunId = testRunRes.id;
	
	return testRunId;
}


const uploadResults = async (resultFileContent) => {
    const testPlanId = await findTestPlan(testPlanName);
	
	if (!testPlanId) {
		console.error('Could not find base test suite');
		return;
	}
	
	console.log(`Found test plan id: ${testPlanId}.`);

	const baseTestSuiteId = await findTestSuiteId(testPlanId, baseTestSuiteName);
	
	if (!baseTestSuiteId) {
		console.error('Could not find base test suite');
		return;
	}
	
	console.log(`Found base test suite id: ${baseTestSuiteId}.`);
	
	const suites = await getExistingSuitesByName(testPlanId);
	
	let results = {};
	let testPoints = [];
	
	for (let i = 0; i < resultFileContent.length; ++i) {
		let feature = resultFileContent[i];
		let featureName = 'Feature ' + feature.name;
		
		let existingSuiteId = suites[featureName];
		
		if (!existingSuiteId) {
			console.log(`Creating suite for ${featureName}`);
			existingSuiteId = await createTestSuite(testPlanId, baseTestSuiteId, featureName);
		}
		
		console.log(`Found suite ${existingSuiteId}`);
		
		// one test case per element
		let elements = feature.elements;
		
		let testCases = await getExistingTestCasesByName(testPlanId, existingSuiteId);
				
		for (let caseIndex = 0; caseIndex < elements.length; ++caseIndex) {
			let testCase = elements[caseIndex];
			
			let testCaseId = testCases[testCase.name];
			
			console.log(`Test case Id: ${testCaseId}`);
			
			if (!testCaseId) {
				console.log(`Case not found, creating new case ${testCase.name}`);
				testCaseId = await createTestCase(testPlanId, existingSuiteId, testCase.name);
			}
			
			let result = didAllPass(testCase.steps);
			
			console.log(`Case ${testCaseId} pass: ${result}`);
			
			let testPointId = await getTestPointForCase(testPlanId, existingSuiteId, testCaseId);
			
			testPoints.push(testPointId);
			
			results[testPointId] = result ? "PASSED" : "FAILED";
		}
	}
	
	console.log('Uploading results');
	
	const testRunId = await createTestRun(testPlanId, testPoints, 'Automated Test Run ' + new Date());
	
    const testResultRes = await http('GET', `_apis/test/runs/${testRunId}/results?api-version=6.0`);
	
	const resultPayload = []
	
	for (let i = 0; i < testResultRes.value.length; ++i) {
		resultPayload.push(
			{
				"id": testResultRes.value[i].id,
				"outcome": results[testResultRes.value[i].testPoint.id],
				"state": "Completed"
			}
		);
	}
	
	console.log(JSON.stringify(resultPayload));
	
	const postResults = await http('PATCH', `_apis/test/runs/${testRunId}/results?api-version=6.0`, resultPayload);
	
	console.log('Finished');
	
	return;
}

//uploadResults(JSON.parse(fs.readFileSync('report.json')));

module.exports = uploadResults;