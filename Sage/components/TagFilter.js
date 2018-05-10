import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import Autocomplete from 'react-native-autocomplete-input';
import constants from '../constants';

export default class TagFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      selectedKeywords: props.initialSelectedOptions ? new Set(props.initialSelectedOptions) : new Set()
    }
  }

  render() {
    return this.props.type === 'adult' ? this.renderAdultFilters() : this.renderChildFilters();
  }

  renderAdultFilters() {
    const { query, selectedKeywords } = this.state;
    const data = query.trim() === '' ? [] : this.props.options.filter(tag => tag.indexOf(query.toLowerCase().trim()) > -1).sort(this.sortAutocompleteData);
    return (
      <View style={styles.container, { paddingBottom: 64 }}>
        <View style={[styles.keywordsContainer, selectedKeywords.size === 0 ? { justifyContent: 'center' } : {}]}>
          {this.renderSelectedKeywords()}
        </View>
        <View style={styles.main}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            data={data.length > 10 ? data.slice(0, 10) : data}
            defaultValue={query}
            onChangeText={text => this.setState({ query: text || '' })}
            onSubmitEditing={this.handleSubmitTagForm.bind(this, data)}
            placeholder="Enter a keyword"
            renderItem={this.renderAutocompleteItem}
          />
          <View style={styles.randomTagContainer}>
            <Text style={styles.text}>Here is a sample of tags that users have used on art matching your interests, tap to add them</Text>
            {this.renderRandomTags()}
          </View>
        </View>
      </View>
    );
  }

  renderChildFilters() {
    return (
      <View style={[styles.container, { paddingBottom: 64 }]}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {this.props.options.map(this.renderChildOption)}
        </ScrollView>
      </View>
    );
  }

  renderChildOption = (option, idx) => {
    const isSelected = this.state.selectedKeywords.has(option);
    const onPress = isSelected ? this.removeSelectedKeyword.bind(this, option) : this.addSelectedKeyword.bind(this, option);
    return (
      <View style={styles.option} key={idx}>
        <TouchableHighlight activeOpacity={0.3} style={[styles.touchable, isSelected ? styles.selectedOption : null]} underlayColor={'#ddd'} onPress={onPress}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderSelectedKeywords() {
    if (this.state.selectedKeywords.size === 0) return <Text style={[styles.text, {fontStyle: 'italic'}]}>Your selected keywords will appear here</Text>
    return (
      <View style={styles.selectedKeywords}>
        {Array.from(this.state.selectedKeywords).map(this.renderSelectedKeyword)}
      </View>
    );
  }

  renderSelectedKeyword = (keyword, idx, arr) => {
    const final = idx === arr.length - 1;
    return (
      <TouchableOpacity key={idx} onPress={this.removeSelectedKeyword.bind(this, keyword)}>
        <Text style={styles.selectedKeyword}>{keyword}{final ? null : ', '}</Text>
      </TouchableOpacity>
    );
  }

  renderAutocompleteItem = item => {
    const { selectedKeywords } = this.state;
    return (
      <TouchableOpacity style={styles.autocompleteItem} onPress={this.addSelectedKeyword.bind(this, item, true)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  }

  renderRandomTags() {
    if (!this.props.randomTags) return;
    this.fontSizes = this.fontSizes || [];
    return (
      <View style={styles.randomTags}>
        {this.props.randomTags.map(this.renderRandomTag)}
      </View>
    );
  }

  renderRandomTag = (tag, idx) => {
    const { selectedKeywords } = this.state;
    this.fontSizes[idx] = this.fontSizes[idx] ? this.fontSizes[idx] : Math.random() < 0.08 ? 26 : Math.random() < 0.2 ? 22 : 16;
    return (
      <TouchableOpacity key={idx} onPress={this.addSelectedKeyword.bind(this, tag.tag)}>
        <Text style={[styles.randomTag, { fontSize: this.fontSizes[idx] }]}>{tag.tag}</Text>
      </TouchableOpacity>
    );
  }

  getRandomTagsByPopularityLevel(numTags, popularityLevel) {
    const tags = constants.popular.filter(tag => {
      if (popularityLevel === 3) return tag.count >= 20;
      if (popularityLevel === 2) return tag.count >= 10 && tag.count < 20;
      if (popularityLevel === 1) return tag.count < 10;
    });
    const result = new Set();

    while (result.size < numTags) {
      let i = Math.round(Math.random() * (tags.length - 1));
      if (!result.has(tags[i].tag)) result.add(tags[i].tag);
    }

    return Array.from(result).map(tag => ({ tag, popularityLevel }));
  }

  handleSubmitTagForm = data => {
    const query = this.state.query.toLowerCase().trim();
    if (!data.includes(query)) return;
    this.addSelectedKeyword(query, true);
  }

  addSelectedKeyword(keyword, clearQuery) {
    if (this.state.selectedKeywords.has(keyword)) return;
    this.props.onChange(keyword);
    this.setState({ selectedKeywords: this.state.selectedKeywords.add(keyword) });
    if (clearQuery) this.setState({ query: '' });
  }

  removeSelectedKeyword(keyword) {
    const { selectedKeywords } = this.state;
    if (selectedKeywords.delete(keyword)) {
      this.setState({ selectedKeywords });
      this.props.onChange(keyword);
    }
  }

  sortAutocompleteData = (a, b) => {
    if (a[0] === this.state.query[0].toLowerCase()) return -1;
    if (b[0] === this.state.query[0].toLowerCase()) return 1;
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }
}

const styles = StyleSheet.create({
  autocompleteItem: {
    padding: 5
  },
  container: {
    flex: 1,
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
    fontFamily: 'System',
    fontSize: 18,
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
