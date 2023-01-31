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

import * as strings from 'SearchSampleProviderWebPartStrings';
import SearchSampleProvider from './components/SearchSampleProvider';
import { ISearchSampleProviderProps } from './components/ISearchSampleProviderProps';
import { IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

export interface ISearchSampleProviderWebPartProps {}

export interface PublishedDataToEsriMapWebPart {
  // strings for constructing where clause to filter feature layer features on Esri Map Web Part side
  filterText?: string[];
  // ... more to come
}

// This is the property Id that ArcGIS map web part is able to listen.
// Please make sure the data from third party provider is published through this property id.
const SourcePropertyId = "esri-dynamic-data";

export default class SearchSampleProviderWebPart extends BaseClientSideWebPart<ISearchSampleProviderWebPartProps> {

  private currentMessage:  PublishedDataToEsriMapWebPart = undefined;
  /**
   * Return list of dynamic data properties that this dynamic data source
   * returns
   */
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      { id: SourcePropertyId, title: 'ArcGIS Dynamic data' }
    ];
  }

  /**
   * Return the current value of the specified dynamic data set
   * @param propertyId ID of the dynamic data set to retrieve the value for
   */
  public getPropertyValue(propertyId: string) {
    switch (propertyId) {
      case SourcePropertyId:
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
    const element: React.ReactElement<ISearchSampleProviderProps> = React.createElement(
      SearchSampleProvider,
      {
        onNotifyChange: this._onPropertyChanged
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

  private _onPropertyChanged = (input:  PublishedDataToEsriMapWebPart): void => {
    this.currentMessage = input;
    // notify subscribers that the selected event has changed
    this.context.dynamicDataSourceManager.notifyPropertyChanged(SourcePropertyId);
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}