import React, { Component } from 'react';
import logo from './logo.svg';
import {CardElement, injectStripe, StripeProvider, Elements} from 'react-stripe-elements';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

var apiEndpoint = "http://localhost:3000/v1/"

class App extends React.Component {
  constructor(props) {
  super(props);
  this.state =
    { name: '',
      email: '',
      giving: '',
      street: '',
      city: '',
      province: '',
      zip: '',
      token: '',
      key: '',
      modal: false,
      modalStatus: '',
      nameError: false,
      emailError: false,
      givingError: false,
      streetError: false,
      cityError: false,
      provinceError: false,
      zipError: false,
      page: 1
    };

  this.handleChange = this.handleChange.bind(this);
  this.handleNameChange = this.handleNameChange.bind(this);
  this.handleEmailChange = this.handleEmailChange.bind(this);
  this.handleGivingChange = this.handleGivingChange.bind(this);
  this.handleStreetChange = this.handleStreetChange.bind(this);
  this.handleCityChange = this.handleCityChange.bind(this);
  this.handleProvinceChange = this.handleProvinceChange.bind(this);
  this.handleZipChange = this.handleZipChange.bind(this);
  this.handleNext = this.handleNext.bind(this);
  this.handleBack = this.handleBack.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.updateToken = this.updateToken.bind(this);
  this.hideModal = this.hideModal.bind(this);
  this.showModal = this.showModal.bind(this);
}

componentDidMount() {
  fetch(apiEndpoint + 'key', {method: 'post'})
    .then(response => response.json())
    .then(key => this.setState({key: key.code}));
}

handleChange(event) {
  this.setState({value: event.target.value});
}
handleNameChange(event) {
  this.setState({name: event.target.value, nameError:''});
}
handleEmailChange(event) {
  this.setState({email: event.target.value, emailError:''});
}
handleGivingChange(event) {
  this.setState({giving: event.target.value, givingError:''});
}
handleStreetChange(event) {
  this.setState({street: event.target.value,streetError:''});
}
handleCityChange(event) {
  this.setState({city: event.target.value,cityError:''});
}
handleProvinceChange(event) {
  this.setState({province: event.target.value, provinceError:''});
}
handleZipChange(event) {
  this.setState({zip: event.target.value, zipError:''});
}

updateToken(event) {
  if (event.token) {
    this.setState({token: event.token.id})
    this.handleNext()
  }
}

handleNext(event) {
  var valid = true
  if (!this.state.name.match(/\w+\s\w/)) {
    valid = false
    this.setState({nameError: true})
  }
  if (!this.state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    valid = false
    this.setState({emailError: true})
  }
  if (!(parseFloat(this.state.giving) > 0)) {
    valid = false
    this.setState({givingError: true})
  }
  if (valid && this.state.page == 1){
    this.setState({page: 2})
  }
}
handleBack(event) {
  if (this.state.page == 2){
    this.setState({page: 1})
  }
}
handleSubmit(event) {
    event.preventDefault();
  if (this.state.page == '1') {

  } else {
    var valid = true
    if (this.state.street.length < 3) {
      valid = false
      this.setState({streetError: true})
    }
    if (this.state.city.length < 1) {
      valid = false
      this.setState({cityError: true})
    }
    if (!this.state.province.match(/^[A-Za-z]{2}$/)) {
      valid = false
      this.setState({provinceError: true})
    }
    if (!this.state.zip.match(/^[0-9]{5}$/)) {
      valid = false
      this.setState({zipError: true})
    }
    if (valid) {
      this.sendToCrm()
    }
  }
}

sendToCrm() {
  var payment = new FormData();
  payment.append("payment", JSON.stringify(
    { name: this.state.name,
      email: this.state.email,
      giving: this.state.giving,
      street: this.state.street,
      city: this.state.city,
      province: this.state.province,
      zip: this.state.zip,
      token: this.state.token,
      key: this.state.key,
    }
  ))

  fetch(apiEndpoint + 'payment',
    { method: 'post', body: payment})
    .then(response => response.json())
    .then(status => this.setState({modalStatus: status.message}))
    .then(value => this.showModal());
}

showModal() {
    this.setState({ modal: true });
  }
hideModal() {
    this.setState({ modal: false });
  }
handleErrors() {
  alert("Cannot send to BBSM.")
}

page1Style() {
  return (
    (this.state.page == 1) ? 'collapse in show' : 'collapse'
  )
}
page2Style() {
  return (
    (this.state.page == 2) ? 'collapse in show' : 'collapse'
  )
}
nameClass() {
  return (
    (this.state.nameError) ? 'form-control is-invalid' : 'form-control'
  )
}
emailClass() {
  return (
    (this.state.emailError) ? 'form-control is-invalid' : 'form-control'
  )
}
givingClass() {
  return (
    (this.state.givingError) ? 'form-control is-invalid' : 'form-control'
  )
}
streetClass() {
  return (
    (this.state.streetError) ? 'form-control is-invalid' : 'form-control'
  )
}
cityClass() {
  return (
    (this.state.cityError) ? 'form-control is-invalid' : 'form-control'
  )
}
provinceClass() {
  return (
    (this.state.provinceError) ? 'form-control is-invalid' : 'form-control'
  )
}
zipClass() {
  return (
    (this.state.zipError) ? 'form-control is-invalid' : 'form-control'
  )
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <h2>My Pledge to BBSM</h2>

        <form onSubmit={this.handleSubmit}
          className="validate">
        <div id="page1"
          className={this.page1Style()} >
          <div className="form-group" >
            <label for="name">Full Name</label>
            <input
              type="text"
              className={this.nameClass()}
              id="name"
              placeholder="First Last"
              value={this.state.name}
              onChange={this.handleNameChange} />
            <div className="invalid-feedback">
              First and Last Name required
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email address</label>
            <input
              type="email"
              className={this.emailClass()}
              id="email"
              placeholder="your@email.address"
              value={this.state.email}
              onChange={this.handleEmailChange} >
            </input>
            <div className="invalid-feedback">
              Email address must be valid
            </div>
          </div>
          <div class="form-group">
            <label for="giving">Monthly Amount</label>
              <input
                type="number"
                className={this.givingClass()}
                id="giving"
                placeholder="25"
                value={this.state.giving}
                onChange={this.handleGivingChange} >
              </input>
            <div className="invalid-feedback">
              Enter the amount to give monthly
            </div>
          </div>
          <StripeProvider apiKey="pk_live_x7LcxFZe7RAdLg0yqViyOrNs">
            <Elements>
                  <CardForm
                    handleResult = {this.updateToken}
                     />
            </Elements>
          </StripeProvider>
          </div>
          <div id="page2"
            className={this.page2Style()} >
            <p>Billing Address</p>

            <div class="form-group">
              <label for="street">Street Address</label>
              <input
                type="text"
                className={this.streetClass()}
                id="street"
                placeholder="123 Main st"
                value={this.state.street}
                onChange={this.handleStreetChange} >
              </input>
              <div className="invalid-feedback">
                Enter a valid Address
              </div>
            </div>
            <div class="form-group">
              <label for="city">City</label>
              <input
                type="text"
                className={this.cityClass()}
                id="city"
                placeholder="Salem"
                value={this.state.city}
                onChange={this.handleCityChange} >
              </input>
              <div className="invalid-feedback">
                City is required
              </div>
            </div>
            <div class="form-group">
              <label for="province">State</label>
              <input
                  type="text"
                  className={this.provinceClass()}
                  id="province"
                  placeholder="OR"
                  value={this.state.province}
                  onChange={this.handleProvinceChange} >
              </input>
              <div className="invalid-feedback">
                Abbreviate the state with 2 letters
              </div>
            </div>
            <div class="form-group">
              <label for="zip">Zipcode</label>
              <input
                type="tel"
                className={this.zipClass()}
                id="zip"
                placeholder="97309"
                value={this.state.zip}
                onChange={this.handleZipChange} >
              </input>
              <div className="invalid-feedback">
                Zipcode should be 5 digits
              </div>
            </div>
            <input
              type ="button"
              value="Back"
              className="btn btn-primary btn-padding"
              onClick={this.handleBack}/>

              <input
                type ="submit"
                value="Done"
                className="btn btn-primary btn-padding"
                onClick={this.handleSubmit}/>
          </div>
          </form>
        </header>
        <Modal show={this.state.modal} handleClose={this.hideModal}>
          <p className="card-status">{this.state.modalStatus}</p>
        </Modal>
      </div>
    );
  }
}

class _CardForm extends React.Component<InjectedProps & {fontSize: string}> {
  handleSubmit(event) {
    event.preventDefault();
    if (this.props.stripe) {
      this.props.stripe.createToken().then(this.props.handleResult);
    } else {
      console.log("stripe not mounted")
    }
  }
  handleChange (error) {
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} >
      <div class="form-group" id="card-data">
        <label className="wide-label">Payment Card</label>
          <CardElement
            className="form-control"
            onChange={this.handleChange}
            hidePostalCode={true}
          />
        </div>
        <input
                type ="submit"
                value="Next"
                className="btn btn-primary"
                onClick={this.handleNext}/>
        </form>
    );
  }
}
const CardForm = injectStripe(_CardForm);

class Modal extends React.Component  {
  constructor(props) {
    super(props);
  }

showModal() {
  return this.props.show ? "modal display-block" : "modal display-none";
}

render(){
    return <div className={this.showModal()}>
      <section className="modal-main">
        {this.props.children}
        <button 
          className="btn btn-primary"
          onClick={this.props.handleClose}>OK</button>
      </section>
    </div>
  }
}

export default App;