import React, { FunctionComponent } from "react";
import SearchableDropdown from "react-native-searchable-dropdown";
import { AppText } from "./AppText";
import { StyleSheet, View } from "react-native";
import _ from "lodash";
import { borderRadius, color, fontSize, size } from "../../common/styles";

const styles = StyleSheet.create({
  label: {
    fontFamily: "brand-bold"
  },
  textInput: {
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
  itemContainer: {
    maxHeight: size(10) * 3,
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("blue", 50)
  },
  item: {
    //single dropdown item style
    paddingHorizontal: size(1.5),
    paddingVertical: size(1.5)
  },
  itemText: {
    fontSize: fontSize(0),
    color: color("blue", 50),
    fontFamily: "brand-regular"
  }
});
interface Dropdown {
  label: string;
  items: { id: string | number; name: string }[];
  onItemSelect: (item: { id: string; name: string }) => void;
}

export const Dropdown: FunctionComponent<Dropdown> = ({
  label,
  items,
  onItemSelect
}) => {
  return (
    <View>
      <AppText style={styles.label}>{label}</AppText>
      <SearchableDropdown
        onTextChange={(text: any) => _.noop(text)}
        //On text change listner on the searchable input
        onItemSelect={onItemSelect}
        //onItemSelect called after the selection from the dropdown
        containerStyle={{ padding: 0 }}
        //suggestion container style
        textInputStyle={styles.textInput}
        itemStyle={styles.item}
        itemTextStyle={styles.itemText}
        itemsContainerStyle={styles.itemContainer}
        items={items}
        //mapping of item array
        // defaultIndex={2}
        //default selected item index
        // textInputProps={{ underlineColorAndroid: "red" }}
        listProps={{
          nestedScrollEnabled: true
        }}
        placeholder="search"
        //place holder for the search input
        resetValue={false}
        //reset textInput Value with true and false state
        underlineColorAndroid="transparent"
        //To remove the underline from the android input
      />
    </View>
  );
};
