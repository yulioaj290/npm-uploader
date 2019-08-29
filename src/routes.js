const router = require('express').Router();
const exec = require('child_process').exec;

router.post('/upload', (req, res) => {
    const data = req.body;
    const command = `bash NPM_UPLOADER.sh ` +
        `${data.unzip ? '-unzip' : ''} -url -rm -push -link ` +
        `${data.gitclon ? '-gitclon' : ''} ${data.deps.length > 0 ? "-" + data.deps : ""} ` +
        `${data.prefix} ${data.weight} ${data.ziplevel} "${data.urllist.join('" "')}"`;

    try {
        // console.log("Running command: " + command);

        // exec(command, (error, stdout, stderr) => {
        exec(`cd src/scripts && ${command}`, (error, stdout, stderr) => {
            if (error) {
                console.error(error.message);
                // return res.send({error: error});
                return res.send({
                    output: error.message,
                    error: "ERROR: The upload process failed, review the output for more details."
                });
            }
            console.log(stdout);
            stdout = stdout.replace(/\[0;31m|\[0;32m|\[0;34m|\[0m/g,"");
            return res.send({output: stdout, error: stderr});
        });
    } catch (err) {
        console.log(err);
        return res.send({error: err});
    }
});

/*

https://dragones.uci.cu
https://gladiadores.uci.cu
https://periodico.uci.cu

* */
//
// router.get('/details', async (req, res) => {
//     try {
//         await userModel.findOne({
//             where: {
//                 id: req.headers.id
//             }
//         }).then((user) => {
//             if (!user) {
//                 return res.send({message: 'User not found!'});
//             } else {
//                 return res.send({user: user});
//             }
//         }).catch((err) => {
//             return res.send(err);
//         });
//     } catch (err) {
//         return res.send(err);
//     }
// });

module.exports = router;
