import React, { Component } from 'react';
import moment from 'moment';
import {
  HorizontalGridLines,
  LineSeries,
  makeWidthFlexible,
  MarkSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

// import * as CONSTANTS from './constants.js'; 

export default class LargeChart extends Component {
  render() {
  	const {highlighted, highlightX, series} = this.props;
  	const minValue = series.reduce((prev, curr) => Math.min(prev, curr.y), Infinity);
  	const maxValue = series.reduce((prev, curr) => Math.max(prev, curr.y), -Infinity);

  	const yDomain = [0.98 * minValue, 1.02 * maxValue];
  	const tickValues = series.map(d => d.x);

    const labelValues = makeLabelValues(series);

    return <div style={{
    	background: 'white',
    	borderRadius: '3px',
    	height: '345px',
    	position: 'relative',
    	width: '100%'
    }}>
    <div style={{
    	fontSize: 20,
      fontWeight: 500,
    	lineHeight: '26px',
    	marginBottom: 12,
      marginLeft: 40
    }}>{this.props.title}</div>
    <FlexibleXYPlot
    	height={300}
    	margin={{top: 5, bottom: 25, left: 40, right: 0}}
    	onMouseLeave={() => this.props.highlightX(null)}
    	yDomain={yDomain}
    >

    	<VerticalGridLines 
    		values={labelValues}
    	/>
        <HorizontalGridLines />
    	<LineSeries 
    		data={series}
    		onNearestX={highlightX}
    		stroke='#11939a'
    		strokeWidth={2}
    	/>
    	{highlighted === undefined ? null : 
    		<LineSeries
    			data={[
    				{x: highlighted && highlighted.x, y: yDomain[0]},
    				{x: highlighted && highlighted.x, y: yDomain[1]}
    			]}
    			stroke='rgba(17,147,154,0.7)'
    			strokeWidth={2}
    		/>
    	}
      {highlighted === undefined ? null : 
        <MarkSeries
          data={[{
            x: highlighted && highlighted.x,
            y: highlighted && series[highlighted.i].y
          }]}
          color='rgba(17,147,154,0.7)'
        />
      }
    	<XAxis 
    		tickSize={4}
    		tickValues={tickValues}
    		labelValues={labelValues}
    		labelFormat={(d) => moment(new Date(d)).format('MM/DD')}
    	/>
        <YAxis 
        	tickSize={4}
        />
    	
    
    </FlexibleXYPlot>
    </div>;
  }
}

export function makeLabelValues(series) {
  const firstDate = new Date(series[0].x);
  const firstDateHour = firstDate.getHours();
  const firstMidnight = series[0].x + (24 - firstDateHour) * HOUR_IN_MS;

  return [0, 1, 2, 3, 4].map(d => firstMidnight + d * DAY_IN_MS);
}