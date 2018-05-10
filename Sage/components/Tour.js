import React, { Component } from 'react';
import {
  NavigatorIOS,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import GalleryView from './GalleryView';
import ObjectView from './ObjectView';

export default class Tour extends Component {
  state = {
    selectedObject: {}
  }

  render() {
    return <NavigatorIOS
      ref='nav'
      translucent={false}
      initialRoute={this.scenes.galleryView}
      style={{ flex: 1 }}
    />
  }

  backToGalleryView = () => {
    this.setState({ selectedObject: {} }, this.refs.nav.pop);
  }

  getSelectedObjectTitle = () => {
    if (!this.state.selectedObject.Location) return;
    return this.state.selectedObject.Location.GalleryShort;
  }

  getTagMatches = () => {
    const tags = this.state.selectedObject.SocialTags;
    if (!tags || !tags.length) return [];
    return tags.filter(tag => this.props.tour[this.state.selectedObject.Location.GalleryShort].tagMatches.includes(tag));
  }

  pushObjectScene = object => {
    this.setState({ selectedObject: object }, () => {
      this.refs.nav.push(this.scenes.objectView);
    })
  }

  addObjectTag = tag => {
    const { selectedObject } = this.state;
    selectedObject.SocialTags ? selectedObject.SocialTags.push(tag) : selectedObject.SocialTags = [tag];
    this.setState({ selectedObject });
  }

  get scenes() {
    return {
      galleryView: {
        component: GalleryView,
        title: 'Tour',
        leftButtonTitle: 'Back',
        onLeftButtonPress: this.props.onReset,
        passProps: {
          tour: this.props.tour,
          pushObjectScene: this.pushObjectScene
        }
      },
      objectView: {
        component: ObjectView,
        title: this.getSelectedObjectTitle(),
        leftButtonTitle: 'Back',
        onLeftButtonPress: this.backToGalleryView,
        passProps: {
          addObjectTag: this.addObjectTag,
          object: this.state.selectedObject,
          tagMatches: this.getTagMatches(),
          createTag: this.props.createTag
        }
      }
    }
  }
}
