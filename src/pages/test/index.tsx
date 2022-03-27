import React, {Component} from 'react';
import { connect } from 'react-redux'
import './style.scss';

interface Props {}

class Test extends Component<Props>{
    constructor(props:any){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        console.log('componentDidMount');
        console.log(this.state,this.props);
    }

    componentWillReceiveProps(nextProps:any) {
        console.log('componentWillReceiveProps');
        console.log('nextProps:' , nextProps);
    }


    render() {
        return (
            <div id="test">
                <p>test page</p>
            </div>
        )
    }

}


export default connect((state:any) => {
    const { UserReducer } = state;
    return {
        UserReducer
    };
},{})(Test)
