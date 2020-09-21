import React, { useState, useEffect, FunctionComponent } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity
} from "react-native";
import { size, fontSize, borderRadius, color } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { AppMode } from "../../context/config";

const styles = StyleSheet.create({
  modalView: {
    paddingHorizontal: 0,
    marginBottom: 0,
    padding: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  crossIconLeft: {
    marginLeft: size(3),
    marginTop: size(7) + 2,
    marginBottom: size(3),
    position: "absolute",
    height: size(2.5),
    // width: 2,
    borderWidth: 1,
    borderRadius: borderRadius(1),
    borderColor: color("grey", 0),
    backgroundColor: color("grey", 0),
    transform: [{ rotate: "45deg" }]
  },
  crossIconRight: {
    marginLeft: size(3),
    marginTop: size(7) + 2,
    marginBottom: size(3),
    position: "absolute",
    height: size(2.5),
    // width: 2,
    borderWidth: 1,
    borderRadius: borderRadius(1),
    borderColor: color("grey", 0),
    backgroundColor: color("grey", 0),
    transform: [{ rotate: "-45deg" }]
  },
  crossText: {
    marginLeft: size(5),
    marginTop: size(7),
    marginBottom: size(3),
    color: color("grey", 0),
    fontSize: fontSize(0),
    fontFamily: "brand-regular"
  },
  searchSection: {
    margin: size(3)
  },
  searchTextInput: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("blue", 50),
    fontSize: fontSize(0),
    color: color("blue", 50),
    fontFamily: "brand-regular"
  },
  listItemView: {
    paddingVertical: size(1)
  },
  listItemContent: {
    paddingVertical: size(3),
    backgroundColor: color("grey", 10)
  },
  listItemTag: {
    marginLeft: size(3),
    fontFamily: "brand-bold",
    color: color("blue", 50),
    fontSize: fontSize(1)
  },
  listItemText: {
    marginLeft: size(3),
    fontFamily: "brand-regular"
  }
});

export interface DropdownItem {
  id: string | number;
  name: string;
  tag?: boolean;
}

export interface DropdownFilterModal {
  isVisible: boolean;
  dropdownItems: DropdownItem[];
  onItemSelection: (item: DropdownItem) => void;
  closeModal: () => void;
}

export const ListItem: FunctionComponent<{
  item: DropdownItem;
  closeModal: () => void;
  onItemSelection: (item: DropdownItem) => void;
}> = ({ item, closeModal, onItemSelection }) => {
  return (
    <View style={styles.listItemView}>
      {item.tag ? (
        <Text style={styles.listItemTag}>{item.name}</Text>
      ) : (
        <TouchableOpacity
          onPress={() => {
            closeModal();
            onItemSelection(item);
          }}
        >
          <View style={styles.listItemContent}>
            <AppText style={styles.listItemText}>{item.name}</AppText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const DropdownFilterModal: FunctionComponent<DropdownFilterModal> = ({
  isVisible,
  dropdownItems,
  onItemSelection,
  closeModal
}) => {
  const [filterState, setFilterState] = useState<DropdownItem[]>(dropdownItems);

  useEffect(() => {
    setFilterState(dropdownItems);
  }, [dropdownItems, isVisible]);

  const searchFilterFunction = (text: string): void => {
    const newData = dropdownItems.filter(item => {
      return item.name.toUpperCase().startsWith(text.toUpperCase());
    });
    setFilterState(newData);
  };

  const renderHeader = (): JSX.Element => {
    return (
      <View>
        <TopBackground
          mode={AppMode.production}
          style={{
            height: "100%",
            top: 0,
            position: "absolute"
          }}
        />
        <TouchableOpacity onPress={closeModal}>
          <View>
            <Text style={styles.crossIconLeft} />
            <Text style={styles.crossIconRight} />
          </View>
          <Text style={styles.crossText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchField = (): JSX.Element => {
    return (
      <View style={styles.searchSection}>
        <AppText style={{ fontFamily: "brand-bold" }}>
          {"Country of nationality"}
        </AppText>
        <TextInput
          style={styles.searchTextInput}
          onChangeText={text => searchFilterFunction(text)}
          underlineColorAndroid="transparent"
          placeholder="Search Country"
          autoCorrect={false}
        />
      </View>
    );
  };

  const renderSeparator = (): JSX.Element => {
    return (
      <View
        style={{
          marginTop: size(1),
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.modalView}>
          {renderHeader()}
          {renderSearchField()}
          {renderSeparator()}
          <FlatList
            // data={nationalityItems}
            data={filterState}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                closeModal={closeModal}
                onItemSelection={onItemSelection}
              />
            )}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
    </Modal>
  );
};
