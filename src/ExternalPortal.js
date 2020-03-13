import React from 'react';
import ReactDOM from 'react-dom';

class ExternalPortal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.window = null;
    }

    componentDidMount() {
        this.window = window.open('', '', 'width=600,height=400');
        this.window.document.title = 'A React portal window';
        this.window.document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        this.window && this.window.close && this.window.close();
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

export default ExternalPortal;
