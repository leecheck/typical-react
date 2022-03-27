import React,{Component} from 'react';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';

class Progress extends Component {
  constructor(props) {
    super(props);
    Nprogress.start();
  }
  componentWillUnmount() {
    Nprogress.done();
    Nprogress.remove();
  }

  render() {
    return <div />;
  }
}
const Loading = ({ isLoading, error }) => {
  // Handle the loading state

  if (isLoading) {
    Nprogress.start();
    return <Progress />;
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else {
    return null;
  }
};

export default Loading;