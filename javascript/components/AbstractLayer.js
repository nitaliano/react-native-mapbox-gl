/* eslint react/prop-types:0  */
import React from 'react';
import MapboxStyleSheet from '../utils/MapboxStyleSheet';
import { getFilter } from '../utils/filterUtils';

class AbstractLayer extends React.Component {
  get baseProps () {
    return {
      ...this.props,
      id: this.props.id,
      sourceID: this.props.sourceID,
      reactStyle: this.getStyle(),
      minZoomLevel: this.props.minZoomLevel,
      maxZoomLevel: this.props.maxZoomLevel,
      aboveLayerID: this.props.aboveLayerID,
      belowLayerID: this.props.belowLayerID,
      layerIndex: this.props.layerIndex,
      filter: getFilter(this.props.filter),
      style: undefined,
    };
  }

  getDefaultStyle () {
    return null;
  }

  getStyle () {
    let styles = [];
    let defaultStyle = this.getDefaultStyle();

    if (defaultStyle) {
      styles.push(defaultStyle);
    }

    if (this.props.style) {
      styles.push(this.props.style);
    }

    if (!styles.length) {
      return;
    }

    let flattenStyle = {};
    for (let style of styles) {
      if (!style) {
        continue;
      }
      const mapboxStyle = this._getMapboxStyleSheet(style);
      flattenStyle = Object.assign(flattenStyle, mapboxStyle);
    }

    return flattenStyle;
  }

  _getMapboxStyleSheet (style) {
    return MapboxStyleSheet.create(style);
  }
}

export default AbstractLayer;
