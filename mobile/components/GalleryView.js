import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  SectionList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import constants from '../constants';

export default class Tour extends Component {
  state = {
    isCollapsed: {}
  }

  constructor(props) {
    super(props);
    const isCollapsed = {};
    const galleries = Object.keys(props.tour).sort();
    galleries.forEach(gallery => isCollapsed[gallery] = true);
    isCollapsed[galleries[0]] = false;
    this.state = {
      isCollapsed
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          contentContainerStyle={styles.scrollView}
          renderItem={this.renderGallery}
          sections={this.getSections()}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }

  renderGallery = ({ item: gallery, index }) => {
    const isCollapsed = this.state.isCollapsed[gallery];
    const headerStyle = isCollapsed || isCollapsed === undefined ? [styles.galleryHeader, styles.galleryHeaderCollapsed] : styles.galleryHeader;
    const objects = this.props.tour[gallery].objects.length > 30 ? this.props.tour[gallery].objects.slice(0, 30) : this.props.tour[gallery].objects;
    return (
      <View key={index} style={styles.gallery}>
        <View style={headerStyle}>
          <TouchableOpacity onPress={this.handlePressCollapseGallery.bind(this, gallery)}>
            <View style={styles.galleryCollapseTrigger}>
              <View style={styles.row}>
                <Text style={styles.galleryHeading}>{gallery}</Text>
                {this.renderTagMatch(gallery)}
                {this.renderClassificationMatches(gallery)}
                {this.renderLocationMatches(gallery)}
              </View>
              <Text style={styles.gallerySubheading}>{`${this.props.tour[gallery].objects.length} ${this.props.tour[gallery].objects.length === 1 ? 'object' : 'objects'}`}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Collapsible collapsed={isCollapsed === undefined ? true : this.state.isCollapsed[gallery]}>
          <View style={styles.galleryObjects}>
            {objects.map(this.renderObject)}
          </View>
        </Collapsible>
      </View>
    );
  }

  renderObject = (object, idx, arr) => {
    const lastChild = idx === arr.length - 1;
    return (
      <TouchableOpacity key={idx} onPress={this.props.pushObjectScene.bind(this, object)}>
        <View style={[styles.object, lastChild ? {} : { borderBottomWidth: 1, borderBottomColor: '#ccc' }]}>
          <View style={styles.thumbnailContainer}>
            {this.state.isCollapsed[object.Location.GalleryShort] ? null : <Image style={styles.thumbnailImage} source={{uri: object.Thumbnail}} />}
          </View>
          <Text numberOfLines={5} style={styles.objectTitle}>{object.Title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderTagMatch(gallery) {
    if (this.props.tour[gallery].tagMatches.length === 0) return;
    return <Text>⭐</Text>;
  }

  renderClassificationMatches(gallery) {
    if (this.props.tour[gallery].classificationMatches.every(classification => !Object.keys(constants.classifications).includes(classification))) return;
    return (
      <View style={styles.row}>
        {this.props.tour[gallery].classificationMatches.map(classification => <Text key={classification}>{constants.classifications[classification]}</Text>)}
      </View>
    );
  }

  renderLocationMatches(gallery) {
    if (this.props.tour[gallery].locationMatches.length === 0) return;
    return (
      <View style={styles.row}>
        {this.props.tour[gallery].locationMatches.map(location => <Text key={location}>{constants.countries[location]}</Text>)}
      </View>
    );
  }

  handlePressCollapseGallery = gallery => {
    const { isCollapsed } = this.state;
    isCollapsed[gallery] = isCollapsed[gallery] === undefined ? false : !isCollapsed[gallery];
    this.setState({ isCollapsed });
  }

  getSections() {
    const galleries = Object.keys(this.props.tour).sort();
    return galleries.map((gallery, index) => ({ data: [gallery] }));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  gallery: {
    backgroundColor: '#fcfcfc',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  galleryHeader: {
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    padding: 10
  },
  galleryHeaderCollapsed: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  galleryHeading: {
    fontSize: 18,
    marginRight: 5,
  },
  gallerySubheading: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ccc'
  },
  galleryObjects: {
    flex: 1,
    padding: 10
  },
  galleryCollapseTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scrollView: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingBottom: 64
  },
  object: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
    paddingBottom: 10,
    paddingTop: 10,
  },
  objectTitle: {
    flex: 1,
    margin: 10
  },
  thumbnailContainer: {
    borderRadius: 8,
    height: 75,
    width: 75
  },
  thumbnailImage: {
    borderRadius:8,
    flex: 1,
    resizeMode: 'cover'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
