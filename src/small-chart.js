import React, { Component } from 'react';
import moment from 'moment';
import {
  LineSeries,
  MarkSeries,
  makeWidthFlexible,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';
import {makeLabelValues} from './large-chart';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

// import * as CONSTANTS from './constants.js'; 

export default class SmallChart extends Component {
  render() {
    const {highlighted, highlightX, series} = this.props;
    if (!series) {
      return <div />;
    }
    const minValue = series.reduce((prev, curr) => Math.min(prev, curr.y), Infinity);
    const maxValue = series.reduce((prev, curr) => Math.max(prev, curr.y), -Infinity);

    const yDomain = [0.98 * minValue, 1.02 * maxValue];
    const labelValues = makeLabelValues(series);

    return <div style={{
      display: 'inline-block',
      height: '225px',
      marginLeft: '-12px',
      marginRight: '24px',
      position: 'relative',
      width: 'calc(25% - 12px)'
    }}>
    
    <div style={{
      background: 'white',
      borderRadius: 3,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
      padding: '12px'
    }}>
    <div style={{
      fontSize: 13,
      lineHeight: '16px',
      marginBottom: 12,
      paddingLeft: 40
    }}>{this.props.title}</div>
    <FlexibleXYPlot
      height={200}
      margin={{top: 5, bottom: 25, left: 40, right: 0}}
      onMouseLeave={() => this.props.highlightX(null)}
      yDomain={yDomain}
    >
      {highlighted === undefined ? null : 
        <MarkSeries
          data={[{
            x: highlighted && highlighted.x,
            y: highlighted && series[highlighted.i].y
          }]}
          color='rgba(17,147,154,0.7)'
          size='2'
        />
      }
      <LineSeries 
        data={series}
        onNearestX={highlightX}
        stroke='#11939a'
        strokeWidth={1}
      />
      <XAxis 
        tickSize={4}
        tickValues={labelValues}
        labelValues={labelValues}
        labelFormat={(d) => moment(new Date(d)).format('MM/DD')}
      />
        <YAxis 
          tickSize={4}
        />
    </FlexibleXYPlot>
    </div>
    </div>;
  }
}