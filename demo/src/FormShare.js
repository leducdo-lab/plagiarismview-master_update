import React,{PureComponent} from "react";

class FormShare extends PureComponent {
    render() {
        return (
            <div className="mb-5 mt-5 px-4">
                <form className="subscribe-form">
                    <div className="form-group d-flex">
                        <div className="icon">
                            <span className="icon-paper-plane"></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Enter Email Address" />
                        <button type="submit" className="btn btn-success">Send</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormShare;
