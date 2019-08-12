import React from 'react';
import './App.css';

function resetKey(){
  localStorage.clear()
  localStorage.setItem("i", 0);
  window.location.reload(); //TODO rerenderowanie a nie odswierzanie
}

function genKey(){
  const newKey = parseInt(localStorage.getItem("i"))
  localStorage.removeItem("i")
  localStorage.setItem("i", (newKey+1))
  return newKey
}

function readHistory(){
  const output = []
  const len = localStorage.length -1
  for(let i = 0; i < len; i++){
    const row = JSON.parse(localStorage.getItem(i))
    output.push(row)

    //debug
    if(i===len-1){
      console.log(row)
      console.log(i)
    }
  }
  return output
}

if(localStorage.getItem("i")===null) resetKey()  //nie działa?

class Calc extends React.Component {
  constructor(props){
    super(props)
    this.state={
      date : null,
      bmi : null,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  formatDate(now){
    return now.getFullYear()+"-"+now.getMonth()+"-"+now.getDay()
  }

  handleSubmit(event){
    event.preventDefault()
    const height = parseInt(event.target.bmiHeight.value) /100 //100 zamienia cm na m
    const weight = parseInt(event.target.bmiWeight.value)
    if(!(height * weight >= 0)){  //sprawdza czy to liczby i czy sa dodatnie
      alert("Proszę podać prawidłową wagę i/lub wzrost!")
      return
    }
    const output = weight / height / height
    this.setState({
      date : this.formatDate(new Date()),
      bmi : String(output.toFixed(2)),
    })
  }
  renderTableData(){
    return readHistory().reverse().map((row, index) => {
        const { id, date, bmi } = row
        return (
            <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{bmi}</td>
            </tr>
          )
        })
      }


  render(){
    if(this.state.bmi !== null){
      const key = genKey()
      const keyObj = {id:(key+1)}
      const obj = this.state
      Object.assign(obj, keyObj)
      localStorage.setItem(key, JSON.stringify(obj))
    }

    return (
      <div align="center">
        <form onSubmit={this.handleSubmit} autocomplete="off">
          Podaj swoją wagę[kg]: <br/>
          <input type="text" name="bmiWeight" /><br/>
          Podaj swój wzrost[cm]: <br/>
          <input type="text" name="bmiHeight"/><br/>
          <input type="submit" value="Oblicz BMI"/>
          <input type="button" value="Zresetuj Tabele" onClick={resetKey}/>
        </form>
        <History value = {this.renderTableData()}/>
      </div>
  )};
}

function History(props){
  if(localStorage.length > 1){
    return (
      <div className="History">
        <table>
          <thead>
            <tr>
              <th>lp</th>
              <th>Data</th>
              <th>BMI</th>
            </tr>
          </thead>
          <tbody>
            {props.value}
          </tbody>
        </table>
      </div>
    )
  }
  return null
}

function App() {
  return (
    <div className="App">
        <h1> Kalkulator BMI </h1>
        <div className="Calculator">
          <Calc />
        </div>
    </div>
  );
}

export default App;
