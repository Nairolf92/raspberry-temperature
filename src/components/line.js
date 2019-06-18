import React from 'react';
import {Line} from 'react-chartjs-2';
import { FaAngleLeft, FaAngleRight} from 'react-icons/fa'; 
import Axios from 'axios';

var dataTemp = {}
// current date = new date toujours pour le calcul des jours
var currentDate = new Date()
// display date = pour la recherche json et affichage
var displayDate = currentDate.toLocaleDateString('fr-FR').slice(0,10);
//console.log("currentdate"+currentDate)
// console.log("displaydate"+displayDate)

export class LineCustom extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.goToPreviousDay = this.goToPreviousDay.bind(this, currentDate); 
    this.goToNextDay = this.goToNextDay.bind(this, currentDate); 
    this.state = {
      arrayDate : this.getArrayOfDate(dataTemp, displayDate),
      tempDate : this.getArrayOfTemp(dataTemp, displayDate),
    }
    
    Axios.get('https://floriankelnerow.ski/raspberry-temperature/data.json',{
    }).then( response => {
      dataTemp = response.data
      this.setState(state => ({
        currentDate : currentDate,
        displayDate : displayDate,
        arrayDate : this.getArrayOfDate(dataTemp, displayDate),
        tempDate : this.getArrayOfTemp(dataTemp, displayDate),
      }));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  goToPreviousDay(currentDate){
    //console.log("goToPreviousDay");
    currentDate.setDate(currentDate.getDate()-1)
    //console.log("currentDate : "+currentDate)
    let displayDate = currentDate.toLocaleDateString('fr-FR')
    //console.log("displayDate : "+displayDate)
    this.setState(state => ({
      currentDate : currentDate,
      displayDate : displayDate,
      arrayDate : this.getArrayOfDate(dataTemp, displayDate),
      tempDate : this.getArrayOfTemp(dataTemp, displayDate),
    }));
    //console.log("this.state.currentDate : "+this.state.currentDate)
    //console.log("this.state.displayDate : "+this.state.displayDate)
    //console.log("END goToPreviousDay")
  }

  goToNextDay(currentDate){
    currentDate.setDate(currentDate.getDate()+1)
    let displayDate = currentDate.toLocaleDateString('fr-FR')
    this.setState(state => ({
      currentDate : currentDate,
      displayDate : displayDate,
      arrayDate : this.getArrayOfDate(dataTemp, displayDate),
      tempDate : this.getArrayOfTemp(dataTemp, displayDate),
    }));
  }

  getArrayOfDate(dataTemp, displayDate)
  {
    // Old way to process
    let data = [];
    for (var key in dataTemp) {
      //console.log(key.substring(0,10))
      if(key.substring(0,10) === displayDate) {
        //console.log(key)
        data.push(key)
      }
    }
    return data
  }

  getArrayOfTemp(dataTemp, displayDate)
  {
    // ES6 format 
    let data = [];
    Object.entries(dataTemp).forEach(([key, value]) => {
      if(key.substring(0,10) === displayDate)
        data.push(value)
    })
    return data
  }

  getFormattedDate(d) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    let year = String(d.getYear());
    year = year -100;
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}-${month}-${year}`;
  }

  render() {
    const data = {
      labels : this.state.arrayDate,
      datasets: [
        {
          label: 'Raspberry temperature (°C)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          data: this.state.tempDate
        }
      ] 
    };

    return (
      <div>
        <span className="changeDate">
          <FaAngleLeft size='3em' onClick={this.goToPreviousDay}/>
          <h2>{this.state.displayDate}</h2>
          <FaAngleRight size='3em' onClick={this.goToNextDay}/>
        </span>

        <Line data={data} />
      </div>
    );
  }
};

export default LineCustom;
