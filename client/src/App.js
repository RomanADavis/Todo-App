import React, { Component } from 'react';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Form from "./Form";

const TodosQuery = gql`
query {
  todos {
    id
    task
    complete
  }
}`;

const UpdateMutation = gql`
mutation($id: ID!, $complete: Boolean!) {
  updateTodo(id: $id, complete: $complete)
}`;

const RemoveMutation = gql`
mutation($id: ID!) {
  removeTodo(id: $id)
}`;

const CreateMutation = gql`
mutation($task: String!){
  createTodo(task: $task){
    id
    task
    complete
  }
}`;

class App extends Component {
  updateTodo = async todo => {
    await this.props.updateTodo({ // database
      variables: {
        id: todo.id,
        complete: !todo.id.complete // toggle
      },
      update: store => {
        const data = store.readQuery({ query: TodosQuery });
        data.todos = data.todos.map(x => x.id === todo.id ? {...todo, complete: !todo.complete} : x);
        store.writeQuery({query: TodosQuery, data});
      }
    });
  };

  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id
      },
      update: store => {
        const data = store.readQuery({query: TodosQuery});
        data.todos = data.todos.filter(x => x.id !== todo.id);
        store.writeQuery({query: TodosQuery, data});
      }
    });
  };

  createTodo = async task => {
    await this.props.createTodo({
      variables: {
        task: task
      },
      update: (store, {data: {createTodo}}) => {
        const data = store.readQuery({query: TodosQuery});
        data.todos.push(createTodo);
        store.writeQuery({query: TodosQuery, data});
      }
    })
  }

  render() {
    const {data: {loading, todos}} = this.props;
    
    if(loading) return "";
    
    return (
      <div style={{display: "flex"}}>
        <div style={{margin: "auto", width: 400}}>
          <Paper elevation={1}>
            <Form submit={this.createTodo}></Form>
            <List>
              {todos.map(todo => (
                <ListItem key={todo.id} role={undefined} dense button onClick={() => this.updateTodo(todo)}>
                  <Checkbox checked={todo.complete} ></Checkbox>
                  <ListItemText primary={todo.task}></ListItemText>
                  
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodo(todo)}>
                      <CloseIcon></CloseIcon>
                    </IconButton>
                  </ListItemSecondaryAction>

                </ListItem>)
              )}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(TodosQuery), 
  graphql(UpdateMutation, {name: "updateTodo"}),
  graphql(RemoveMutation, {name: "removeTodo"}),
  graphql(CreateMutation, {name: "createTodo"})
)(App);
