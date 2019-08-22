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
            output: "Sample output .............",
            error: ""
        }
    }

    handleChange = (e) => {
        const id = e.target.id;
        const value = id === "unzip" ? e.target.checked : e.target.value;
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState[id] = value;
            return newState;
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.validate();
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

        if (!/^[a-zA-Z0-9_-]*$/g.test(this.state.prefix)) {
            error = `ERROR: Prefix must be only alphanumeric, (_) and (-), without spaces. [${this.state.prefix}]`
        }

        if (!/^[1-9]\d*$/g.test(this.state.weight)) {
            error = `ERROR: Weight must be positive numeric greater than 0. [${this.state.weight}]`
        }

        if (!/^[1-9]$/g.test(this.state.ziplevel)) {
            error = `ERROR: Compression level must be between 1 and 9. [${this.state.ziplevel}]`
        }

        if (error.length > 0) {
            this.setState({
                output: JSON.stringify(urllist) + "\n" + this.state.prefix + "\n" + this.state.weight + "\n" + this.state.ziplevel + "\n" + this.state.unzip + "\n",
                error: error
            });
            return false;
        } else {
            this.setState({
                error: ""
            });
            return true;
        }
    };

    validateUrl = (value) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    };

    render() {
        const {urllist, prefix, weight, ziplevel, unzip, output, error} = this.state;

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
                            <textarea id={"urllist"} value={urllist} onChange={this.handleChange}
                                      placeholder={"Enter one valid URL per line"} required></textarea>
                            <p>List of URLs of the resources on Internet. Eg.: http://mi.pagina.com/video.mp4</p>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="prefix">Prefix <span className={"required"}>*</span></label>
                            <input type="text" id={"prefix"} value={prefix} onChange={this.handleChange}
                                   placeholder={"Prefix of packages"} required/>
                            <p>Package's prefix. Eg.: video-tutorial, library123, photo-book</p>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="weight">Chunk's Weight</label>
                            <input type="number" id={"weight"} value={weight} min={"1"} onChange={this.handleChange}
                                   defaultValue={"50"}/>
                            <p>Chunk's weight in megabytes (MB), 50MB by default. </p>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="ziplevel">Compression Level</label>
                            <input type="number" id={"ziplevel"} value={ziplevel} onChange={this.handleChange}
                                   defaultValue={"5"} max={"9"} min={"1"}/>
                            <p>Compression level from 1 to 9, 5 by default. High value means high compression.</p>
                        </div>
                        <div className={"option-group"}>
                            <input type="checkbox" id={"unzip"} checked={unzip} onChange={this.handleChange}/>
                            <label className={"checkbox-label"} htmlFor="unzip">Auto unzip functions</label>
                        </div>
                        <div className={"form-group"}>
                            <button type={"submit"}>Upload</button>
                        </div>
                    </form>
                </div>

                <hr/>

                <div className={"output"}>
                    <h2>Output</h2>
                    <p>{output}</p>
                </div>
            </div>
        );
    }
}

export default App;
