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

import * as strings from 'SampleProviderWebPartStrings';
import SampleProvider from './components/SampleProvider';
import { ISampleProviderProps } from './components/ISampleProviderProps';
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

export interface ISampleProviderWebPartProps { }

export interface PublishedDataToEsriMapWebPart {
  // strings for constructing where clause to filter feature layer features on Esri Map Web Part side
  filterText?: string[];
  // ... more to come
}

// This is the property Id that ArcGIS map web part is able to listen.
// Please make sure the data from third party provider is published through this property id.
const sourcePropertyId = "esri-dynamic-data";

export default class SampleProviderWebPart extends BaseClientSideWebPart<ISampleProviderWebPartProps> implements IDynamicDataCallables {


  private currentMessage: PublishedDataToEsriMapWebPart = undefined;
  /**
   * Return list of dynamic data properties that this dynamic data source
   * returns
   */
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      { id: sourcePropertyId, title: 'ArcGIS Dynamic data' }
    ];
  }

  /**
   * Return the current value of the specified dynamic data set
   * @param propertyId ID of the dynamic data set to retrieve the value for
   */
  public getPropertyValue(propertyId: string) {
    switch (propertyId) {
      case sourcePropertyId:
        return this.currentMessage;
    }

    throw new Error('Bad property id');
  }

  public async onInit(): Promise<void> {
    // this line below is important! This enables this web part as a publisher for dynamic data.
    this.context.dynamicDataSourceManager.initializeSource(this);
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ISampleProviderProps> = React.createElement(
      SampleProvider,
      {
        onNotifyChange: this._onPropertyChanged.bind(this)
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

  private _onPropertyChanged(input: PublishedDataToEsriMapWebPart): void {
    // update local cache for property fetch
    this.currentMessage = input;

    // notify subscribers that the selected event has changed
    this.context.dynamicDataSourceManager.notifyPropertyChanged(sourcePropertyId);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
