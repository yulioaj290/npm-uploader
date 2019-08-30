const router = require('express').Router();
const exec = require('child_process').exec;
const fs = require('fs');

router.post('/upload', (req, res) => {
    const data = req.body;
    let command = `bash NPM_UPLOADER.sh ` +
        `${data.unzip ? '-unzip' : ''} -url -rm -push -link ` +
        `${data.gitclon ? '-gitclon' : ''} ${data.deps.length > 0 ? "-" + data.deps : ""} ` +
        `${data.prefix} ${data.weight} ${data.ziplevel} "${data.urllist.join('" "')}"`;


    // command = 'pwd && ls -la';

    try {
        exec(`cd src/scripts && ${command}`, (error, stdout, stderr) => {
            let stdoutClean = stdout.replace(/(\[0;31m)|(\[0;32m)|(\[0;34m)|(\[0m)/g, "");
            if (error) {
                console.error(error.message);
                let message = error.message;

                if (/\[\sERROR\s]:/g.test(stdoutClean)) {
                    message = stdoutClean;
                }

                return res.send({
                    output: message,
                    error: "ERROR: The upload process failed, review the output for more details.",
                });
            }

            console.log(stdout);

            _listPackages(function (data) {
                return res.send({
                    output: stdoutClean,
                    error: (stderr.length > 0 ? stderr : data.error),
                    packages: data.packages
                });
            });
        });
    } catch (err) {
        console.log(err.message);
        return res.send({error: err});
    }
});

router.get('/packages', (req, res) => {
    try {
        _listPackages(function (data) {
            return res.send({
                error: data.error,
                packages: data.packages
            });
        });
    } catch (err) {
        console.log(err);
        return res.send({error: err});
    }
});

router.post('/unpush', (req, res) => {
    const data = req.body;
    let command = `bash NPM_UPLOADER.sh -unpush ${data.pack}`;

    try {
        exec(`cd src/scripts && ${command}`, (error, stdout, stderr) => {
            if (error) {
                console.error(error.message);
                return res.send({
                    output: error.message,
                    error: "ERROR: The unpublish process failed, review the output for more details.",
                });
            }

            console.log(stdout);
            stdout = stdout.replace(/\[0;31m|\[0;32m|\[0;34m|\[0m/g, "");

            _listPackages(function (data) {
                return res.send({
                    output: stdout,
                    error: (stderr.length > 0 ? stderr : data.error),
                    packages: data.packages
                });
            });
        });
    } catch (err) {
        console.log(err);
        return res.send({error: err});
    }
});

function _listPackages(callback) {
    let file = "src/scripts/remove.lock";
    let error = "";
    let packages = [];

    fs.readFile(file, 'utf-8', (err, content) => {
        if (err) {
            // error = err.message;
            // console.log(err.message);
            // error = "ERROR: Was not possible to read the \"remove.lock\" file.";
            // return [];
        } else {
            packages = content.split(/\r?\n/).filter((line) => {
                return line.length > 0;
            });
        }

        // console.log(JSON.stringify(packages));

        return callback({packages: packages, error: error});
    });
}

module.exports = router;
