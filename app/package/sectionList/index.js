import React, { Component } from 'react';
import { View, Text, SectionList } from 'react-native';
import Card from '../../widget/card';
import Package from '../../widget/package';
import { TouchableOpacity } from 'react-native-gesture-handler';

const COMPONENT_LABEL = '高性能的分组(section)列表';
const COMPONENT_VALUE = 'SectionList';

const SECTIONS = [
  { title: 'Title1', data: ['item1', 'item2'] },
  { title: 'Title2', data: ['item3', 'item4'] },
  { title: 'Title3', data: ['item5', 'item6'] },
  { title: 'Title4', data: ['item7', 'item8'] },
  { title: 'Title5', data: ['item9', 'item10'] },
  { title: 'Title6', data: ['item11', 'item12'] },
  { title: 'Title7', data: ['item1', 'item2'] },
  { title: 'Title8', data: ['item3', 'item4'] },
  { title: 'Title9', data: ['item5', 'item6'] },
  { title: 'Title10', data: ['item7', 'item8'] },
  { title: 'Title11', data: ['item9', 'item10'] },
  { title: 'Title12', data: ['item11', 'item12'] }
];
class SectionListPackage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  previewDemoOne = list => {
    return (
      <View style={{ height: 360, width: 340, padding: 10 }}>
        <SectionList
          renderItem={({ item, index, section }) => (
            <Text
              onPress={() => {}}
              key={index}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                textAlign: "center",
                height: 40,
                lineHeight: 40
              }}
            >
              {item}
            </Text>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              onPress={() => {}}
              style={{
                fontWeight: "bold",
                padding: 4,
                fontSize: 16,
                backgroundColor: "#eee"
              }}
            >
              {title}
            </Text>
          )}
          sections={SECTIONS}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  };

  render() {
    return (
      <Package
        label={COMPONENT_LABEL}
        value={COMPONENT_VALUE}
        navigation={this.props.navigation}
      >
        {/** demo - 1 */}
        <Card html={COMPONENT_VALUE} codeHeight={750}>
          {this.previewDemoOne()}
        </Card>
      </Package>
    );
  }
}

export default SectionListPackage;
