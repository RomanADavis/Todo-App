import React from "react";
import TextField from "@material-ui/core/TextField";

export default class Form extends React.Component {
    state = {task: ""};

    handleChange = (event) => {
        this.setState({task: event.target.value});
    };
    
    handleKeyDown = (event) => {
        if (event.key === "Enter"){
            this.props.submit(this.state.task);
            this.setState({task: ""});
        }        
    };

    render() {
        const {task} = this.state;

        return (
            <TextField 
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown} 
                id="addTodo" 
                label="todo..." 
                margin="normal" 
                value ={task} 
                fullWidth
            />
        );
    }
}