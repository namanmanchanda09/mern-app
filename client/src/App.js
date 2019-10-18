import React from 'react';
import './App.css';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemText from '@material-ui/core/ListItemText';
import * as compose from 'lodash.flowright';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const UsersQuery = gql`
{
  users{
    id
    name
    adult
  }
}
`;

const UpdateMutation = gql`
mutation($id:ID!, $adult:Boolean!){
  updateUser(id:$id,adult:$adult)
}
`;

const RemoveMutation = gql`
mutation($id:ID!){
  removeUser(id:$id)
}
`;



class App extends React.Component{
  updateUser = async user =>{
    await this.props.updateUser({
      variables :{
        id: user.id,
        adult: !user.adult
      }
    })
  };

  removeUser = async user =>{
    await this.props.removeUser({
      variables:{
        id: user.id
      }
    })
  }

  render(){
    const {data : {loading, users}} = this.props;
    if(loading){
      return null;
    }
    return users.map(user => (
      <div key={`${user.id}-user-number`} className="App" onClick={() => (this.removeUser(user))}>
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItem button>
            Name : {user.name}
            <br />
            Adult : {user.adult.toString()}
          </ListItem>
          <ListItemSecondaryAction>
                      <IconButton>
                        <CloseIcon />
                      </IconButton>
          </ListItemSecondaryAction>
          

        </List>
      </div>
      )
    )
  }
}

export default compose(
graphql(RemoveMutation, {name: 'removeUser'}),
graphql(UpdateMutation, {name: 'updateUser'}),
(graphql(UsersQuery)))(App);







