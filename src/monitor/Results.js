import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import { Container, Row, Col } from 'react-grid-system';
import axios from 'axios';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results : []
    };
  }
  componentWillMount(){
    //this.context.socket.on('result', this.handleData.bind(this));
    console.log("props"+this.props.jobId);
    var url="http://localhost:6007/stages?jobId="+this.props.jobId;
    this.serverRequest =
      axios
        .get(url)
        .then((result) => {
          console.log(result.data);
          this.setState({
            stageList: result.data
          });
        });
        console.log(this.state.stageList);
  }

  render() {
    var arr=[];
    for(var key in this.state.stageList){
      console.log(key);
      const value = this.state.stageList[key];
      console.log(JSON.parse(value).status);
      if(JSON.parse(value).status=="Completed" || JSON.parse(value).status=="Failed"){
        if(key==this.props.stageName){
          arr.push(
            <Container>
              <Tabs style={{'margin':'auto','width':'100%','marginTop':'-15'}}>
                  <Tab label="STDOUT" style={{'backgroundColor':'#009688'}}>
                      <div>
                      <pre>  {JSON.parse(value).result.stdout}</pre>
                      </div>
                    </Tab>
                    <Tab label="STDERR" style={{'backgroundColor':'#009688'}}>
                        <pre>{JSON.parse(value).result.stderr}</pre>
                   </Tab>
                   <Tab label="EXITCODE" style={{'backgroundColor':'#009688'}}>
                  <pre> stage exited with code :{JSON.parse(value).result.exitCode}</pre>
                   </Tab>
            </Tabs>
          </Container>
          );
        }
      }
    }
    return (
      <div>
        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" onClick={this.props.handleClick.bind(this,1,this.props.jobId)}>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        {arr}
    </div>
    );
  }
}
Results.contextTypes = {
  socket:React.PropTypes.object
};
export default Results;
