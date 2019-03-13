// /* 
//  DEFAULT
//  */
// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };

let request = require('request');
const YAML = require('yamljs');
const uuidv4 = require('uuid/v4');
// uuidv4();

/*
 Required environment vars
 */
const userAgent = process.env['USER_AGENT']
const username = process.env['USERNAME']
const email = process.env['EMAIL']
const key = process.env['KEY']

const urlToUpdate = `https://${username}:${key}@api.github.com/repos/alandooz/timeline/_data/microposts.yml`


/**
 * Takes a URL for a Github repository and remove the
 * first part containing github.com
 * @param url
 * @returns {string}
 */
const parseUrlForRepoName = (url) => {
    if (url.indexOf('https') < 0) {

    }
    const githubString = 'https://github.com'
    return url.substring(githubString.length, url.length)
}


/**
 * Helper method to get option object for a request
 * @param method
 * @param url
 * @returns {{url: *, method: string, headers: {User-Agent: *}}}
 */
const getOptionsForRequest = (method, url) => {
    return {
        url: url,
        method: method.toUpperCase(),
        headers: {
            'User-Agent': userAgent
        }
    }
}


/**
 * Return information for a Github repsository
 * Resolves with information parsed as JSON
 * @param url
 * @returns {Promise}
 */
const getRepoInformation = (url) => {

    return new Promise((resolve, reject) => {

        const options = getOptionsForRequest('get', url)
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return
            }

            const repoData = JSON.parse(body)
            console.info(`Fetched:: ${repoData.name} (${repoData.url})`)
            resolve(repoData)
        })
    })
}


/**
 * Updates selected properties on editor object
 * @param githubInformation
 * @param editor
 */
const updateFile = (githubInformation, editor) => {
    editor.stargazers_count = githubInformation.stargazers_count
    editor.open_issues = githubInformation.open_issues
    editor.watchers = githubInformation.watchers
    editor.updated_at = githubInformation.updated_at
    editor.github_description = githubInformation.description
}


/**
 *
 * @param editors
 * @param sha
 * @returns {Promise}
 */
const updateRepo = (editors, sha) => {

    return new Promise((resolve, reject) => {
        const yamlString = YAML.stringify(editors, 2)
        const base64Yaml = new Buffer(yamlString)

        const updateOptions = getOptionsForRequest('put', urlToUpdate)
        updateOptions.body = JSON.stringify({
            "message": "Updated editors.yml with Lambda",
            "committer": {
                "name": username,
                "email": email
            },
            "content": base64Yaml.toString('base64'),
            "sha": sha
        })

        request(updateOptions, function (error, response, body) {
            if (error) {
                reject(error)
                return
            }

            const parsedBody = JSON.parse(body)
            const result = `Done:: File is pushed with SHA: ${parsedBody.commit.sha} (${parsedBody.commit.html_url})`
            resolve(result)
        })
    })

}

const start = (event, context, callback) => { //Learn more about these lamba params at http://docs.aws.amazon.com/lambda/latest/dg/welcome.html

    const options = getOptionsForRequest('get', urlToUpdate)
    getRepoInformation(options.url)
        .then(repoData => {

            const fileContent = Buffer.from(repoData.content, 'base64')
            const editors = YAML.parse(String(fileContent))

            const repoFetches = editors.map(editor => {
                const repoPath = parseUrlForRepoName(editor.github)
                const repoUrl = `https://${username}:${key}@api.github.com/repos${repoPath}`
                return getRepoInformation(repoUrl)
                    .then(repoInformation => {
                        updateFile(repoInformation, editor)
                    })
            })

            Promise.all(repoFetches).then(() => {
                console.info(`All editors updated`)

                updateRepo(editors, repoData.sha).then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null)
                })

            })
        })
}


if (process.env['LAMBDA_TASK_ROOT']) { // Running in AWS Lamba
    exports.handler = (event, context, callback) => {
        process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']
        start(event, context, callback)
    }

} else { // Running in local environment
    start({}, {}, (error, result) => {
        console.info(result)
    })
}
