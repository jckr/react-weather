import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/main.css';
import {json} from 'd3-request';
import * as CONSTANTS from './constants';
import secrets from './secrets.json';
const {API} = secrets;

import LargeChart from './large-chart';
import SmallChart from './small-chart';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: null
    };
    this.highlightX = this.highlightX.bind(this);
    this.processResults = this.processResults.bind(this);
  }
  
  componentWillMount() {
    json(`${CONSTANTS.QUERY_PREFIX}?id=${CONSTANTS.CITY_ID}&appid=${API}&units=imperial`,
      this.processResults);
  }
  
  highlightX(highlighted) {
    this.setState({highlighted});
  }
  
  processResults(error, queryResults) {
    if (error) {
      this.setState({error});
    }
    const data = CONSTANTS.KEYS.map(key => ({
      key,
      values: queryResults.list.map((d, i) => ({
        i,
        x: d.dt * 1000,
        y: d[key.key1] ? d[key.key1][key.key2] || 0 : 0 
      }))
    })).reduce((prev, curr) => {
      return {...prev, [curr.key.name]: curr.values}
    }, {
      'city-name': (
        queryResults &&
        queryResults.city &&
        queryResults.city.name
      ) || 'Unkown'
    });
    this.setState({data});
  }

  render() {
    const {data, error, highlighted} = this.state;
    if (error) {
      return <div>
        <div>Error loading weather information</div>
        <div>{JSON.stringify(this.state.error)}</div>
      </div>;
    }
    if (data) {
      return <div
        className='app'
      >
        <div
          className='title'
          style={{
            background: '#282727',
            color: 'white',
            fontSize: 26,
            fontWeight: 500,
            height: 38,
            lineHeight: '38px',
            padding: '21px 24px 12px'
          }}>
          {data['city-name'] ?
            `Weather predictions for ${data['city-name']}` :
            null}
        </div>
        <div
        className='card'
        style={{
          background: 'white',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
          borderRadius: 3,
          margin: 12,
          padding: 24,
          position: 'relative'
        }}>
          
          <LargeChart
            highlighted={highlighted}
            highlightX={this.highlightX}
            series={data.Temperature}
            title='Temperature'
          />
        </div>
        <div
          className='bottom-row'
          style={{
            margin: '0 -12px 0 24px',
          }}
        >
          <SmallChart
          highlighted={highlighted}
          highlightX={this.highlightX}
          series={data.Pressure}
          title='Pressure'
          />
          <SmallChart
            highlighted={highlighted}
            highlightX={this.highlightX}
            series={data.Cloudiness}
            title='Cloudiness'
          />
          <SmallChart
            highlighted={highlighted}
            highlightX={this.highlightX}
            series={data['Wind speed']}
            title='Wind Speed'
          />
          <SmallChart
            highlighted={highlighted}
            highlightX={this.highlightX}
            series={data.Rain}
            title='Rain'
          />
        </div>
      </div>;
    }
    return <div>
      Loading data...
    </div>
  }
}

export default App;
