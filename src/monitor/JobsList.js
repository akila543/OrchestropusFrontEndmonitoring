import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import { Container, Row, Col } from 'react-grid-system';
import Divider from 'material-ui/Divider';
import io from 'socket.io-client';
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';

class JobsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList : [],
      results : [],
      status : '',
      socket : io('http://localhost:4070/'),
    };
  }
  componentDidMount(){
    var _this = this;
    this.serverRequest =
      axios
        .get("http://localhost:6007/jobs",)
        .then(function(result) {
          // console.log("result is ");
          // console.log(result.data);
          _this.setState({
            jobList: result.data
          });
          // console.log("state is "+_this.state.jobList);
        });
//    this.state.socket.on('result', this.handleStatus.bind(this));
  }







    render() {
    var jobs = this.state.jobList.reverse().map((job)=>{
      return(
        <Container>
          <Card style={{'width':'100%','margin':'auto','marginTop':10}} onClick={this.props.handleClick.bind(this,1,job.jobId,'')}>
            <Row>
                <Col sm={6}>
                  <CardHeader
                    title={job.jobId}
                  />
                </Col>
                <Col sm={4} style={{'marginTop':15}}>
                <Avatar
                  color={orange200}
                  backgroundColor={pink400}
                  size={20}
                />
                </Col>
                <Col sm={2} style={{'marginTop':15}}>
                  <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
                      <path d="M0-.25h24v24H0z" fill="none"/>
                  </svg>
                </Col>
            </Row>
        </Card>
      </Container>
      );
    });
    return(
        <div>
              {jobs}
        </div>
    );
  }
}
JobsList.contextTypes = {
  socket:React.PropTypes.object
};

export default JobsList;
