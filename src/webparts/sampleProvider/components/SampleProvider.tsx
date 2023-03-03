/*
 Copyright 2023 ESRI

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import * as React from 'react';
import styles from './SampleProvider.module.scss';
import { ISampleProviderProps } from './ISampleProviderProps';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Sector } from 'recharts';
import data from './samples.json';

const sampleStates = data.sampleStates;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#853a45'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const SampleProvider = (props: ISampleProviderProps) => {

  const [currentActiveIndex, setCurrentActiveIndex] = React.useState(undefined);

  return (
    <div className={styles.sampleProvider}>
      <div className={styles.container}>
        <div className={styles.row}>
          <span className={styles.title}>Sample provider - pie chart </span>
        </div>
        <div className={styles.row}>
          <ResponsiveContainer width={320} height={200} style={{ marginTop: 10 }}>
            <PieChart width={320} height={200}>
              <Pie data={sampleStates} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d"
                activeIndex={currentActiveIndex}
                activeShape={renderActiveShape}
                onClick={(_, index) => {
                  setCurrentActiveIndex(index);
                  props.onNotifyChange({ filterText: [sampleStates[index]?.name] });
                }}>{sampleStates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))} </Pie>
              <Legend layout="vertical" align="right" />
            </PieChart>
          </ResponsiveContainer>
          <p className={styles.description}>{(currentActiveIndex || currentActiveIndex === 0) ? `Current message: ${sampleStates[currentActiveIndex]?.name}` : "No current message"}</p>
          <button onClick={() => {
            props.onNotifyChange({ filterText: [] });
            setCurrentActiveIndex(undefined);
          }}>Clear selection</button>
        </div>
      </div>

    </div>
  );
};

export default SampleProvider;