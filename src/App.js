import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Switch, withRouter } from 'react-router-dom'
import axios from 'axios'
import config from './config'
import './App.css'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import {
  AddForm,
  Chatbot,
  CheckoutForm,
  EditForm,
  MyCalendar,
  MyMap,
  MyNav,
  NotFound,
  SignIn,
  SignUp,
  TodoDetail,
  TodoList
} from './components'



class App extends Component {

  state = {
    todos: [],
    user: null,
    error: null,
    fetchingUser: true, 
  }

  handleSignUp = (e) => {
    e.preventDefault()
    const {username, email , password} = e.target
    let newUser = {
      username: username.value, 
      email: email.value, 
      password: password.value
    }
    
    axios.post(`${config.API_URL}/api/signup`, newUser, {withCredentials: true})
      .then((response) => {
        //the real data is always in response.data
          this.setState({
            user: response.data //save the user info in the state
          }, () => {
              //Redirect after the user info has been fetched
              this.props.history.push('/')
          })
      })
      .catch(() => {
        console.log('SignUp failed')
      })
  }

  handleSignIn = async (e) => {
    e.preventDefault()
    const { email , password} = e.target
    let newUser = {
      email: email.value, 
      password: password.value
    }

    axios.post(`${config.API_URL}/api/signin`, newUser, {withCredentials: true})
      .then((response) => {
        this.setState({
          user: response.data,
          error: null
        }, () => {
          this.props.history.push('/')
        })
      })
      .catch((errorObj) => {
        this.setState({
          error: errorObj.response.data
        })
      })
  }

  // ---------------------SIGN IN WITH ASYNC AWAIT----------------------
  // -------------------COMPLETELY OPTIONAL------------------------------
  //-----------DONT FREAK OUT READING THE CODE OK? ---------------------------
  /*
  handleSignIn = async (e) => {
    e.preventDefault()
    const { email , password} = e.target
    let newUser = {
      email: email.value, 
      password: password.value
    }
    try {
      let response = await axios.post(`${config.API_URL}/api/signin`, newUser, {withCredentials: true})
      this.setState({
        user: response.data,
        error: null
      }, this.props.history.push('/'))
    }
    catch(errorObj){
      this.setState({
        error: errorObj.response.data
      })
    }
  }
  */

  handleLogout = () => {
      axios.post(`${config.API_URL}/api/logout`, {}, {withCredentials: true})
        .then(() => {
          this.setState({
            user: null
          })
        })
        .catch((errorObj) => {
          // the real error json is always is the .response.data 
          this.setState({
            error: errorObj.response.data
          })
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let name = event.target.name.value
    let description = event.target.description.value

    let image = event.target.todoImage.files[0]
    let formData = new FormData()
    formData.append( 'imageUrl' ,  image   )

    // sending image to the coudinary route
    axios.post(`${config.API_URL}/api/upload`, formData)
      .then((response) => {
        //chaining promises
        return  axios.post(`${config.API_URL}/api/create`, {
                    name: name,
                    description: description,
                    completed: false,
                    image: response.data.image
                  }, {withCredentials: true})
      })
      .then((response) => {
        // 2. Once the server has successfully created a new todo, update your state that is visible to the user
        this.setState({
          todos: [response.data, ...this.state.todos]
        }, () => {
          //3. Once the state is update, redirect the user to the home page
          this.props.history.push('/')
        })

      })
      .catch((err) => {
        console.log('Create failed', err)
      })
  }

  handleDelete = (todoId) => {
    //1. Make an API call to the server side Route to delete that specific todo
    axios.delete(`${config.API_URL}/api/todos/${todoId}`, {withCredentials: true})
      .then(() => {
         // 2. Once the server has successfully created a new todo, update your state that is visible to the user
          let filteredTodos = this.state.todos.filter((todo) => {
            return todo._id !== todoId
          })

          this.setState({
            todos: filteredTodos
          }, () => {
            this.props.history.push('/')
          })
      })
      .catch((err) => {
        console.log('Delete failed', err)
      })

  }

  handleEditTodo = (todo) => {
      axios.patch(`${config.API_URL}/api/todos/${todo._id}`, {
        name: todo.name,
        description: todo.description,
        completed: todo.completed,
      }, {withCredentials: true})
        .then(() => {
            let newTodos = this.state.todos.map((singleTodo) => {
                if (todo._id === singleTodo._id) {
                  singleTodo.name  = todo.name
                  singleTodo.description = todo.description
                }
                return singleTodo
            })
            this.setState({
              todos: newTodos
            }, () => {
              this.props.history.push('/')
            })

            
        })
        .catch((err) => {
          console.log('Edit failed', err)
        })

  }

    // Make sure all the initial data that you show to the user is fetched here
  
  componentDidMount(){
      axios.get(`${config.API_URL}/api/todos`, {withCredentials: true})
        .then((response) => {
          console.log(response.data)
          this.setState({ todos: response.data})
        })
        .catch(() => {
          console.log('Fecthing failed')
        })
  
      
      axios.get(`${config.API_URL}/api/user`, {withCredentials: true}) 
        .then((response) => {
          this.setState({ 
            user: response.data,
            fetchingUser: false,
          })
        })
        .catch((errorObj) => {
          this.setState({
            error: errorObj.response.data,
            fetchingUser: false,
          })
        })
  }

  
  // -------------------OPTIONAL--------------------------------------------
  // -----------------IN CASE YOU WANT TO USE ASYNC AWAIT ------------------
  // -----------DONT FREAK OUT READING THE CODE OK? ------------------------

  // Only when you want to run things synchronously
  /*
  async componentDidMount(){
    try{
      let response = await axios.get(`${config.API_URL}/api/todos`, {withCredentials: true})
       this.setState({ todos: response.data})
      let userResponse = await  axios.get(`${config.API_URL}/api/user`, {withCredentials: true}) 
      this.setState({ 
        user: userResponse.data,
        fetchingUser: false,
      })
    }
    catch(err){
      this.setState({
        error: errorObj.response.data,
        fetchingUser: false,
      })
    }
  }
  */
  
  render() {
    const {todos, error, user, fetchingUser} = this.state

    // 
    if(fetchingUser){
      return <p>Loading . . . </p>
    }

    const promise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

    return (
      <div>
        <div className="App">
          <Elements stripe={promise}>
            <CheckoutForm />
          </Elements>
        </div>
        <MyNav onLogout={this.handleLogout} user={user} />
        <MyCalendar />
        <MyMap />
        <Chatbot />
        <h1>Shopping List</h1>
        <Switch>
            <Route exact path="/" render={() => {
                return <TodoList todos={todos} />
            }} />
            <Route  path="/todos/:todoId" render={(routeProps) => {
                return <TodoDetail user={user} onDelete={this.handleDelete} {...routeProps} />
            }} />
             <Route path="/add-form" render={() => {
                return <AddForm onAdd={this.handleSubmit} />
            }} />
            <Route  path="/todo/:todoId/edit" render={(routeProps) => {
                return <EditForm onEdit={this.handleEditTodo} {...routeProps}/>
            }} />
            <Route  path="/signin"  render={(routeProps) => {
              return  <SignIn error={error} onSignIn={this.handleSignIn}  {...routeProps}  />
            }}/>
            <Route  path="/signup"  render={(routeProps) => {
              return  <SignUp onSubmit={this.handleSignUp} {...routeProps}  />
            }}/>
            <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)



