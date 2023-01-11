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
import styles from './SampleConsumer.module.scss';
import { ISampleConsumerProps } from './ISampleConsumerProps';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SampleConsumer = (props: ISampleConsumerProps) => {

  const sanitizedSelectionInfo = React.useMemo(() => {
    if (props.arcGISWebPartSelectionInfo?.selectedItems) {
      return props.arcGISWebPartSelectionInfo.selectedItems.map(feature => {
        return {
          name: feature.attributes.Title,
          q1Sale: feature.attributes.JanuarySales + feature.attributes.FebruarySales + feature.attributes.MarchSales,
          q2Sale: feature.attributes.AprilSales + feature.attributes.MaySales + feature.attributes.JuneSales,
          q3Sale: feature.attributes.JulySales + feature.attributes.AugustSales + feature.attributes.SeptemberSales,
          q4Sale: feature.attributes.OctoberSales + feature.attributes.NovemberSales + feature.attributes.DecemberSales,
          totalSale: feature.attributes.TotalSales
        };
      });
    } else {
      return undefined;
    }
  }, [props.arcGISWebPartSelectionInfo]);


  return (<div className={styles.sampleConsumer}>
    <div className={styles.container}>
      <div className={styles.row}>
        {props?.arcGISWebPartSelectionInfo?.selectedItems ? <div className={styles.column}>
          <span className={styles.title}>Selection details:</span>
          <p>Current layer: {props?.arcGISWebPartSelectionInfo.layerInfo?.title || "unknown"}</p>
          <hr></hr>
          <p>Selection count: {props?.arcGISWebPartSelectionInfo?.selectedItems.length || 0}</p>
          <hr></hr>
          <div style={{ backgroundColor: "white", width: 500, height: 300 }}>
            <ResponsiveContainer width={500} height={300}>
              <BarChart
                width={500}
                height={300}
                data={sanitizedSelectionInfo}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="q1Sale" stackId="a" fill="#8884d8" />
                <Bar dataKey="q2Sale" stackId="a" fill="#82ca9d" />
                <Bar dataKey="q3Sale" stackId="a" fill="#FFBB28" />
                <Bar dataKey="q4Sale" stackId="a" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> : <div>
          <p>Make selection on sample layer</p>
        </div>}
      </div>
    </div>
  </div>);
};


export default SampleConsumer;