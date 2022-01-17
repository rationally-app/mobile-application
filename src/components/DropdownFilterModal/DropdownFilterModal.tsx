import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { borderRadius, color, fontSize, size } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { AppMode } from "../../context/config";
import { AntDesign } from "@expo/vector-icons";
import { PolicyChoices } from "../../types";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  modalView: {
    paddingHorizontal: 0,
    marginBottom: 0,
    padding: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "white",
    borderRadius: 20,
  },
  header: {
    height: "100%",
    top: 0,
    position: "absolute",
  },
  separator: {
    marginVertical: size(1),
    height: 1,
    width: "100%",
    backgroundColor: "#CED0CE",
  },
  closeTouchable: {
    marginTop: size(7),
    marginBottom: size(3),
    flexDirection: "row",
  },
  emoji: {
    fontSize: fontSize(3),
    marginLeft: size(2),
    marginRight: size(0.5),
    color: color("grey", 0),
  },
  crossText: {
    fontSize: fontSize(0),
    marginRight: size(0.5),
    color: color("grey", 0),
  },
  searchSection: {
    margin: size(3),
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
    fontFamily: "brand-regular",
  },
  listItemView: {
    paddingVertical: size(1),
  },
  listItemContent: {
    paddingVertical: size(3),
    backgroundColor: color("grey", 10),
  },
  listItemTag: {
    marginLeft: size(3),
    fontFamily: "brand-bold",
    color: color("blue", 50),
    fontSize: fontSize(1),
  },
  listItemText: {
    marginLeft: size(3),
    fontFamily: "brand-regular",
  },
});

export interface DropdownFilterModal {
  isVisible: boolean;
  dropdownItems: PolicyChoices[];
  label: string;
  placeholder: string;
  onItemSelection: (item: PolicyChoices) => void;
  closeModal: () => void;
}

export const ListItem: FunctionComponent<{
  item: PolicyChoices;
  closeModal: () => void;
  onItemSelection: (item: PolicyChoices) => void;
}> = ({ item, closeModal, onItemSelection }) => {
  const { c13nt } = useTranslate();

  return (
    <View style={styles.listItemView}>
      {item.tag ? (
        <Text style={styles.listItemTag}>
          {c13nt(item.value, undefined, item.label)}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={() => {
            closeModal();
            onItemSelection(item);
          }}
        >
          <View style={styles.listItemContent}>
            <AppText style={styles.listItemText}>
              {c13nt(item.value, undefined, item.label)}
            </AppText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const DropdownFilterModal: FunctionComponent<DropdownFilterModal> = ({
  isVisible,
  dropdownItems,
  label,
  placeholder,
  onItemSelection,
  closeModal,
}) => {
  const { c13nt } = useTranslate();
  const [filterState, setFilterState] = useState<PolicyChoices[]>(
    dropdownItems
  );

  useEffect(() => {
    setFilterState(dropdownItems);
  }, [dropdownItems, isVisible]);

  const searchFilterFunction = (text: string): void => {
    const newData = dropdownItems.filter((item) => {
      return c13nt(item.value, undefined, item.label)
        .toUpperCase()
        .includes(text.trim().toUpperCase());
    });
    setFilterState(newData);
  };

  const renderHeader = (): JSX.Element => {
    return (
      <View>
        <TopBackground mode={AppMode.production} style={styles.header} />
        <TouchableOpacity style={styles.closeTouchable} onPress={closeModal}>
          <AntDesign name="close" style={styles.emoji} />
          <Text style={styles.crossText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchField = (): JSX.Element => {
    return (
      <View style={styles.searchSection}>
        <AppText style={{ fontFamily: "brand-bold" }}>{label}</AppText>
        <TextInput
          style={styles.searchTextInput}
          onChangeText={(text) => searchFilterFunction(text)}
          underlineColorAndroid="transparent"
          placeholder={placeholder}
          autoCorrect={false}
        />
      </View>
    );
  };

  const renderSeparator = (): JSX.Element => {
    return <View style={styles.separator} />;
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
            data={filterState}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                closeModal={closeModal}
                onItemSelection={onItemSelection}
              />
            )}
            keyExtractor={(item) => item.label ?? item.value}
          />
        </View>
      </View>
    </Modal>
  );
};
