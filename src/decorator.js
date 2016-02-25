'use strict';

import React from 'react';
import Radium from 'radium';

export function Decorator(component, radiumConfig) {
  if (typeof component !== 'function') {
    radiumConfig = component;
    return function(component) {
      return Decorator(component, radiumConfig);
    };
  }

  if (!component.contextTypes) component.contextTypes = {};
  component.contextTypes.theme = React.PropTypes.object.isRequired;
  component.contextTypes.styles = React.PropTypes.object.isRequired;

  let originalComponentWillMount = component.prototype.componentWillMount;
  component.prototype.componentWillMount = function() {
    this.Radium = Radium;
    this.theme = this.context.theme;
    this.styles = this.context.styles;
    if (originalComponentWillMount) originalComponentWillMount.call(this);
  };

  let originalComponentWillReceiveProps = component.prototype.componentWillReceiveProps;
  component.prototype.componentWillReceiveProps = function(nextProps, nextContext) {
    this.theme = nextContext.theme;
    this.styles = nextContext.styles;
    if (originalComponentWillReceiveProps) originalComponentWillReceiveProps.call(this, nextProps, nextContext);
  };

  return Radium(radiumConfig)(component);
}

export default Decorator;
