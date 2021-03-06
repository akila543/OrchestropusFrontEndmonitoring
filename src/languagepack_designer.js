import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import LanguagePack from './languagepack.js';


const style = {
  marginRight: 20,
  float: "left"
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941



class LanguagePackDesigner extends Component {
  constructor() {
                      super();
                      this.state={
                                    open:false,
                                    value:'',
                                    values:[],
                                    creator:'',
                                    name:'',
                                    version:'',
                                    tags:[],
                                    description:'',open_editor:false,
                                    repo_url:''
  }
  this.handleCreate=this.handleCreate.bind(this);
}

handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

handleClick(){
  //alert('klkl')
}

handleChange(propertyname,event) {
  if(propertyname=='creator')
  {

    this.setState({creator:event.target.value});
  }
  else  if(propertyname=='name')
  {

    this.setState({name:event.target.value});
  }
  else  if(propertyname=='desc')
  {

    this.setState({description:event.target.value});
  }
  else  if(propertyname=='version')
  {

    this.setState({version:event.target.value});
  }
  else  if(propertyname=='tags')
  {
    var tagArr = event.target.value.split(",");
    this.setState({tags:tagArr});
  }


 }

// handleSubmit(event) {
//     var target =event.target
//     var name = target.name.value
//     alert(name)
//     var items = this.state.values
//     items.push(name)
//     alert(items)
//     this.setState({values:items})
//     event.preventDefault();
//   }

  handleCreate()
  {

    var that=this;
    axios.post('https://api.github.com/user/repos',{
        "name": this.state.name,
        "description": "This is your first repository",
        "homepage": "https://github.com",
        "private": false,
        "has_issues": true,
        "has_projects": true,
        "has_wiki": true
    }, {
      headers: {'Content-Type':'application/json','Authorization':'Bearer d6eec293ed5a64a243a894499bb9148bc1105312'}

    })
     .then(function (response) {
      console.log(response.data.clone_url);
      that.setState({repo_url:response.data.clone_url});

   })
    .catch(function (error) {
      console.log(error);
    });


   if(this.state.creator==''|| this.state.tags==''||this.state.version==''||this.state.name==''||this.state.description=='')
   {
     alert("Please enter all the entries");
   }
   else {
         this.setState({open:false})
         this.setState({open_editor:true});
   }



  }



  render() {
    const actions = [
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleCreate}
      />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
    />,

  ];

    return (
    <MuiThemeProvider >{this.state.open_editor?<LanguagePack name={this.state.name} creator={this.state.creator} description={this.state.description} tags={this.state.tags} version={this.state.version} repo_url={this.state.repo_url}/>:
      <div className="App">
      <FloatingActionButton style={style} onTouchTap={this.handleClick.bind(this)}>
        <ContentAdd label="Dialog" onTouchTap={this.handleOpen}/>
        </FloatingActionButton>

        <Dialog
         title="Create Language Pack"
         actions={actions}
         modal={false}
         open={this.state.open}
         onRequestClose={this.handleClose}>

         <label>
         Creator:
         <input type="text"  value={this.state.creator} onChange={this.handleChange.bind(this,"creator")}/>
         </label><br/>
         <label>
         LanguagePack Name:
         <input type="text"  value={this.state.name} onChange={this.handleChange.bind(this,"name")}/>
         </label><br/>
         <label>
         Description:
         <input type="text"  value={this.state.description} onChange={this.handleChange.bind(this,"desc")}/>
         </label><br/>
         <label>
         Version:
         <input type="text"  value={this.state.version} onChange={this.handleChange.bind(this,"version")} />
         </label><br/>
         <label>
         Tags:
         <input type="text"  value={this.state.tags} onChange={this.handleChange.bind(this,"tags")}/>
         </label><br/>
       </Dialog>
      </div>}
    </MuiThemeProvider>
    );
  }
}

export default LanguagePackDesigner;
