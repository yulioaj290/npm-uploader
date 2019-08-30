import React from 'react';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            urllist: "",
            prefix: "",
            weight: 50,
            ziplevel: 5,
            unzip: true,
            gitclon: false,
            deps: "",
            output: "Sample output .............",
            error: "",
            success: false,
            packages: []
        }
    }

    componentDidMount() {
        this.packageList();
    }

    // componentDidUpdate() {
    //     this.packageList();
    // }

    packageList = () => {
        fetch(process.env.REACT_APP_API_URL + '/npm/packages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(jsonRes => {
                this.setState({
                    packages: jsonRes.packages,
                    error: (
                        jsonRes.error.length > 0
                            ? jsonRes.error
                            : this.state.error
                    )
                });
            })
            .catch((err) => {
                if (err.length > 0) {
                    console.log(err);
                    this.setState({error: err});
                    this.setState({error: "ERROR: Was not possible to read the \"remove.lock\" file."});
                }
            });
    };

    handleUnpush = (pack) => {
        fetch(process.env.REACT_APP_API_URL + '/npm/unpush', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({pack: pack})
        })
            .then(response => response.json())
            .then(jsonRes => {
                this.setState({
                    output: jsonRes.output,
                    error: jsonRes.error,
                    packages: (typeof jsonRes.packages !== "undefined" ? jsonRes.packages : this.state.packages)
                });

                if (this.state.error.length <= 0) {
                    this.setState({
                        success: true,
                        urllist: "",
                        prefix: "",
                        weight: 50,
                        ziplevel: 5,
                        unzip: true,
                        gitclon: false
                    });
                } else {
                    this.setState({success: false});
                }
            })
            .catch((err) => {
                if (err.length > 0) {
                    console.log(err);
                    this.setState({error: "ERROR: The unpublish process fail, try again."})
                }
            });
    };

    handleChange = (e) => {
        const name = e.target.name;
        const value = ((name === "unzip" || name === "gitclon") ? e.target.checked : e.target.value);
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState[name] = value;
            return newState;
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.validate()) {
            const data = {
                urllist: this.state.urllist.split(/\r?\n/),
                prefix: this.state.prefix,
                weight: this.state.weight,
                ziplevel: this.state.ziplevel,
                unzip: this.state.unzip,
                gitclon: this.state.gitclon,
                deps: this.state.deps
            };
            fetch(process.env.REACT_APP_API_URL + '/npm/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(jsonRes => {
                    this.setState({
                        output: jsonRes.output,
                        error: jsonRes.error,
                        packages: (typeof jsonRes.packages !== "undefined" ? jsonRes.packages : this.state.packages)
                    });

                    // console.log(this.state.error);
                    if (this.state.error.length <= 0) {
                        this.setState({
                            success: true,
                            urllist: "",
                            prefix: "",
                            weight: 50,
                            ziplevel: 5,
                            unzip: true,
                            gitclon: false
                        });
                    } else {
                        this.setState({success: false});
                    }
                })
                .catch((err) => {
                    if (err.length > 0) {
                        console.log(err);
                        this.setState({error: "ERROR: The upload process fail, try again."})
                    }
                });
        }
    };

    validate = () => {
        let error = "";

        const urllist = this.state.urllist.split(/\r?\n/);
        for (let i = 0; i < urllist.length; i++) {
            if (!this.validateUrl(urllist[i])) {
                error = `ERROR: Incorrect or malformed URL, verify it please. [${urllist[i]}]`;
                break;
            }
        }

        if (this.state.gitclon && urllist.length > 1) {
            error = `ERROR: You can download only one GIT repository.`
        }

        if (!this.state.gitclon && this.state.deps.length > 0) {
            error = `ERROR: To install dependencies, you need to clone GIT repository.`
        }

        if (!/^[a-zA-Z0-9-]*$/g.test(this.state.prefix)) {
            error = `ERROR: Prefix must be only alphanumeric and (-), without spaces. [${this.state.prefix}]`
        }

        if (!/^[1-9]\d*$/g.test(this.state.weight)) {
            error = `ERROR: Weight must be positive numeric greater than 0. [${this.state.weight}]`
        }

        if (!/^[1-9]$/g.test(this.state.ziplevel)) {
            error = `ERROR: Compression level must be between 1 and 9. [${this.state.ziplevel}]`
        }

        if (error.length > 0) {
            this.setState({
                error: error,
                output: error
            });
            return false;
        } else {
            this.setState({
                // output: JSON.stringify(urllist) + "\n" + this.state.prefix + "\n" + this.state.weight + "\n" + this.state.ziplevel + "\n" + this.state.unzip + "\n",
                error: ""
            });

            // Success!
            return true;
        }
    };

    validateUrl = (value) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    };

    render() {
        const {urllist, prefix, weight, ziplevel, unzip, gitclon, deps, output, error, success, packages} = this.state;

        return (
            <div className="app">

                <h1>NPM Uploader</h1>

                <hr/>

                <div className={"form"}>
                    {
                        error.length > 0 ?
                            <div className={"error"}>
                                {error}
                            </div>
                            : ""
                    }
                    <form action="#" onSubmit={this.handleSubmit}>
                        <div className={"form-group"}>
                            <label htmlFor="urllist">URL List <span className={"required"}>*</span></label>
                            <textarea id={"urllist"} name={"urllist"} value={urllist} onChange={this.handleChange}
                                      placeholder={"Enter one valid URL per line"} required autoFocus/>
                            <p>List of URLs of the resources on Internet. Eg.: http://mi.pagina.com/video.mp4</p>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="prefix">Prefix <span className={"required"}>*</span></label>
                            <input type="text" id={"prefix"} name={"prefix"} value={prefix} onChange={this.handleChange}
                                   placeholder={"Prefix of packages"} required/>
                            <p>Package's prefix. Eg.: video-tutorial, library123, photo-book</p>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="weight">Chunk's Weight</label>
                            <input type="number" id={"weight"} name={"weight"} value={weight} min={"1"}
                                   onChange={this.handleChange}/>
                            <p>Chunk's weight in megabytes (MB), 50MB by default. </p>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="ziplevel">Compression Level</label>
                            <input type="number" id={"ziplevel"} name={"ziplevel"} value={ziplevel}
                                   onChange={this.handleChange} max={"9"}
                                   min={"1"}/>
                            <p>Compression level from 1 to 9, 5 by default. High value means high compression.</p>
                        </div>
                        <div className={"option-group"}>
                            <input type="checkbox" id={"unzip"} name={"unzip"} checked={unzip}
                                   onChange={this.handleChange}/>
                            <label className={"checkbox-label"} htmlFor="unzip">Auto unzip functions</label>
                        </div>
                        <div className={"option-group"}>
                            <input type="checkbox" id={"gitclon"} name={"gitclon"} checked={gitclon}
                                   onChange={this.handleChange}/>
                            <label className={"checkbox-label"} htmlFor="gitclon">Clone GIT Repository</label>
                        </div>
                        <div className={"option-group"}>
                            <p>Install Dependencies:</p>
                            <input type="radio" id={"depsnpm"} checked={deps === "depsnpm"}
                                   name={"deps"} value={"depsnpm"} onChange={this.handleChange}/>
                            <label className={"checkbox-label"} htmlFor="depsnpm">NPM</label>
                            &nbsp;&nbsp;&nbsp;
                            <input type="radio" id={"depsyarn"} checked={deps === "depsyarn"}
                                   name={"deps"} value={"depsyarn"} onChange={this.handleChange}/>
                            <label className={"checkbox-label"} htmlFor="depsyarn">YARN</label>
                        </div>
                        <div className={"form-group"}>
                            <button type={"submit"}>Upload</button>
                        </div>
                    </form>
                </div>

                <hr/>

                {
                    typeof packages !== "undefined" && packages.length > 0 ?
                        (
                            <div className={"packages"}>
                                <h2>Unpublish packages from NPMJS.com</h2>
                                {
                                    packages.map((pack, i) => {
                                        return (
                                            <button key={i} onClick={() => this.handleUnpush(pack)}>
                                                {pack.split(/_/)[0]}
                                            </button>
                                        );
                                    })
                                }

                                {
                                    packages.length >= 2 ?
                                        (
                                            <div className={"all"}>
                                                <button onClick={() => this.handleUnpush("")}>
                                                    Unpublish all packages [{packages.length}]
                                                </button>
                                            </div>
                                        )
                                        : ""
                                }
                                <hr/>
                            </div>
                        )
                        :
                        ""
                }

                <div className={"output"}>
                    <h2>Output</h2>
                    <div className={error.length > 0 ? "error" : (success ? "success" : "")}>
                        <pre>
                            {output}
                        </pre>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
