import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Button } from 'antd';
import {userAction} from '../../actions/UserAction'
import './style.scss';

interface Props {
    userAction:any,
    history:any
}

class User extends Component<Props>{
    constructor(props:any){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        console.log('componentDidMount');
        console.log(this.state,this.props);
        this.props.userAction();
    }

    componentWillReceiveProps(nextProps:any) {
        console.log('componentWillReceiveProps');
        console.log('nextProps:' , nextProps);
    }


    render() {
        return (
            <div id="user">
                <p>user page</p>
                <Button type="primary" onClick={this.handleClick}> jump </Button>
            </div>
        )
    }

    handleClick = () => {
        console.log('handleClick');
        this.props.history.push('test');
    }

}


export default connect((state:any) => {
    const { UserReducer } = state;
    return {
        UserReducer
    };
},{ userAction })(User)
