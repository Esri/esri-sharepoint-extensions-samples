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
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import SampleConsumer from './components/SampleConsumer';
import { ISampleConsumerProps } from './components/ISampleConsumerProps';
import { ArcGISSelectionData, SalesData } from './interface';

// This is the component Id for all ArcGIS for Sharepoint web part, please use this component Id to filter ArcGIS map web part.
const ArcGISMapWebPartComponentId = "74d48445-8546-4cf0-a3ca-2e49279b3887";
// This is the property Id to listen to layer selection events published by ArcGIS map web part.
const dynamicDataPropertyId = "layer-selection";

export interface ISampleConsumerWebPartProps { }

export default class SampleConsumerWebPart extends BaseClientSideWebPart<ISampleConsumerWebPartProps> {

  private _arcGISWebPartSelectionInfo: ArcGISSelectionData<SalesData>;
  private _currentAvailableMapWebParts;

  public async onInit(): Promise<void> {
    this.context.dynamicDataProvider.registerAvailableSourcesChanged(async () => {

      // fetch available map web part currently within page
      const mapWebPartSources = this.context.dynamicDataProvider.getAvailableSources().filter(source => {
        return source.metadata?.componentId === ArcGISMapWebPartComponentId;
      });

      if (mapWebPartSources?.length > 0) {
        if (this._currentAvailableMapWebParts?.length > 0) {
          this._currentAvailableMapWebParts.forEach(webPart => {
            try {
              // Unregister callback on map web part update or removed
              this.context.dynamicDataProvider.unregisterPropertyChanged(webPart.dynamicDataSource.id, dynamicDataPropertyId, webPart.callBack);
            } catch (e) {
              console.log(e);
            }
          });
        }
        this._currentAvailableMapWebParts = mapWebPartSources.map(webPartSource => {
          return {
            dynamicDataSource: webPartSource,
            // Generate callback for each map web parts on the page
            callBack: async () => {
              const selectionInfo = await webPartSource.getPropertyValueAsync(dynamicDataPropertyId) as ArcGISSelectionData<SalesData>;
              if (selectionInfo) {
                this._arcGISWebPartSelectionInfo = selectionInfo;
                this.render();
              }
            }
          };
        });
        this._currentAvailableMapWebParts.forEach(webPart => {
          // Register listener for "layer-selection" event on target map webpart
          this.context.dynamicDataProvider.registerPropertyChanged(webPart.dynamicDataSource.id, dynamicDataPropertyId, webPart.callBack);
        });
      }
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ISampleConsumerProps> = React.createElement(
      SampleConsumer,
      {
        arcGISWebPartSelectionInfo: this._arcGISWebPartSelectionInfo
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
