import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import constants from '../constants';

const { width, height } = Dimensions.get('window');

export default class ObjectView extends Component {
  state = {
    customTag: '',
    isFullScreenImageOpen: false
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={styles.top}>
              <View style={styles.titleAndThumbnailContainer}>
                <View style={styles.header}>
                  <Text style={styles.title} numberOfLines={1}>{this.props.object.Title}</Text>
                </View>
                <View style={styles.thumbnailContainer}>
                  <TouchableOpacity style={{flex: 1}} onPress={this.showFullScreenImage}>
                    <Image source={{uri: this.props.object.Image}} style={styles.thumbnailImage} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.bottom}>
              <View style={styles.infoContainer}>
                {this.renderArtist()}
                {this.renderClassification()}
                {this.renderCountry()}
                {this.renderDate()}
                {this.renderMedium()}
                {this.renderStyle()}
                {this.renderSocialTags()}
              </View>
            </View>
            <Modal animationType="slide" visible={this.state.isFullScreenImageOpen}>
              <View style={styles.fullScreen}>
                <TouchableOpacity style={{flex: 1}} onPress={this.hideFullScreenImage}>
                  <Image source={{uri: this.props.object.Image}} style={styles.fullScreenImage} />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }

  renderArtist() {
    if (!this.props.object.Artists || !this.props.object.Artists.length) return;
    return (
      <View style={styles.entry}>
        <Text style={styles.entryKey}>Artist</Text>
        <Text style={styles.entryValue}>{this.props.object.Artists[0].Artist}</Text>
      </View>
    );
  }

  renderClassification() {
    const classification = this.props.object.Classification;
    return (
      <View style={styles.entry}>
        <Text style={styles.entryKey}>Classification</Text>
        <Text style={styles.entryValue}>{classification}</Text>
      </View>
    );
  }

  renderCountry() {
    if (!this.props.object.Geography) return;
    const country = Object.keys(constants.countries).find(country => this.props.object.Geography.indexOf(country) > -1);
    return (
      <View style={styles.entry}>
        <Text style={styles.entryKey}>Country</Text>
        <Text style={styles.entryValue} numberOfLines={1}>{country}</Text>
      </View>
    );
  }

  renderDate() {
    if (!this.props.object.Dated) return;
    return (
      <View style={styles.entry}>
        <Text style={styles.entryKey}>Date</Text>
        <Text style={styles.entryValue} numberOfLines={1}>{this.props.object.Dated}</Text>
      </View>
    );
  }

  renderMedium() {
    if (!this.props.object.Medium) return;
    return (
      <View style={styles.entry}>
        <Text style={styles.entryKey}>Medium</Text>
        <Text style={styles.entryValue} numberOfLines={1}>{this.props.object.Medium}</Text>
      </View>
    );
  }

  renderStyle() {
    if (!this.props.object.Style) return;
    return (
      <View style={styles.entry}>
        <Text style={styles.entryKey}>Style</Text>
        <Text style={styles.entryValue} numberOfLines={1}>{this.props.object.Style}</Text>
      </View>
    );
  }

  renderSocialTags() {
    const tags = this.props.object.SocialTags;
    return (
      <View style={styles.socialTags}>
        <Text style={[styles.entryKey, { marginBottom: 5 }]}>Social Tags:</Text>
        <View style={styles.row}>
          {!tags || !tags.length ? <Text style={styles.italic}>No one has tagged this piece yet</Text> : tags.map(this.renderSocialTag)}
        </View>
        <View style={[styles.row, styles.tagInputContainer]}>
          <TextInput returnKeyType="done" blurOnSubmit autoCorrect={false} autoCapitalize="none" onSubmitEditing={this.handleCreateTag} onChangeText={customTag => this.setState({ customTag })} value={this.state.customTag} style={styles.tagInput} placeholder="Add your own tag!" />
          <TouchableOpacity onPress={this.handleCreateTag} style={styles.button}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderSocialTag = (tag, idx, arr) => {
    const final = idx === arr.length - 1;
    return (
      <Text key={tag} style={[styles.socialTag, this.props.tagMatches.includes(tag) ? styles.matchedTag : null]}>{tag}{final ? null : ', '}</Text>
    );
  }

  handleCreateTag = () => {
    if (!this.state.customTag || this.state.customTag === '') return alert('Enter a tag');
    this.props.createTag(this.props.object.ObjectID, this.state.customTag, () => {
      this.props.addObjectTag(this.state.customTag);
      this.setState({ customTag: '' });
    });
  }

  showFullScreenImage = () => {
    this.setState({ isFullScreenImageOpen: true });
  }

  hideFullScreenImage = () => {
    this.setState({ isFullScreenImageOpen: false });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingBottom: 64
  },
  fullScreen: {
    flex: 1,
    marginTop: 10
  },
  bottom: {
    flex: 2,
    padding: 10,
  },
  top: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontFamily: 'System',
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    width: 300
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    borderColor: '#ccc',
    borderWidth: 1
  },
  header: {
    backgroundColor: '#fefefe',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  titleAndThumbnailContainer: {
    borderColor: '#ccc',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    height: height / 3,
    flex: 1,
  },
  thumbnailContainer: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    padding: 10
  },
  thumbnailImage: {
    flex: 1,
    resizeMode: 'contain'
  },
  fullScreenImage: {
    flex: 1,
    resizeMode: 'contain'
  },
  infoTop: {
    flex: 1
  },
  socialTags: {
    padding: 10,
  },
  entry: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  entryKey: {
    fontFamily: 'System',
    fontWeight: 'bold'
  },
  entryValue: {
    fontFamily: 'System',
    maxWidth: width * 0.65
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  socialTag: {
    fontFamily: 'System',
    marginRight: 5
  },
  matchedTag: {
    color: '#e83a17'
  },
  italic: {
    fontStyle: 'italic'
  },
  tagInputContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 10,
    height: 35,
    padding: 8,
    width: width / 2
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 35,
    width: 35,
    backgroundColor: '#b5ff6b'
  }
});
