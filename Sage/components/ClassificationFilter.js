import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import constants from '../constants';

export default class ClassificationFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      selectedKeywords: props.initialSelectedOptions ? new Set(props.initialSelectedOptions) : new Set()
    }
  }

  render() {
    const classifications = Object.keys(this.props.options);
    return (
      <View style={styles.container}>
        {classifications.map(this.renderClassification)}
      </View>
    );
  }

  renderClassification = (classification, idx) => {
    const isSelected = this.state.selectedKeywords.has(classification);
    const onPress = isSelected ? this.removeSelectedKeyword.bind(this, classification) : this.addSelectedKeyword.bind(this, classification);
    return (
      <View key={idx} style={styles.optionContainer}>
        <View style={styles.option} key={idx}>
          <TouchableHighlight activeOpacity={0.3} style={[styles.touchable, isSelected ? styles.selectedOption : null]} underlayColor={'#ddd'} onPress={onPress}>
            <Text style={styles.optionText}>{this.props.options[classification]}</Text>
          </TouchableHighlight>
        </View>
        <Text style={styles.text}>{classification}</Text>
      </View>
    );
  }

  addSelectedKeyword(keyword) {
    if (this.state.selectedKeywords.has(keyword)) return;
    this.props.onChange(keyword);
    this.setState({ selectedKeywords: this.state.selectedKeywords.add(keyword) });
  }

  removeSelectedKeyword(keyword) {
    const { selectedKeywords } = this.state;
    if (selectedKeywords.delete(keyword)) {
      this.setState({ selectedKeywords });
      this.props.onChange(keyword);
    }
  }
}

const styles = StyleSheet.create({
  autocompleteItem: {
    padding: 5
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F5FCFF'
  },
  keywordsContainer: {
    flexDirection: 'row',
    padding: 20
  },
  main: {
    paddingLeft: 20,
    paddingRight: 20
  },
  randomTagContainer: {
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    marginTop: 25,
    paddingTop: 10
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 64,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    margin: 20,
  },
  selectedOption: {
    backgroundColor: '#ccc'
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    width: 70,
    height: 70
  },
  optionContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionText: {
    fontSize: 48
  },
  list: {
    backgroundColor: 'white',
    padding: 5
  },
  randomTags: {
    alignItems: 'baseline',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  randomTag: {
    color: '#e83a17',
    marginRight: 5
  },
  selectedKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  text: {
    fontFamily: 'System'
  }
});
