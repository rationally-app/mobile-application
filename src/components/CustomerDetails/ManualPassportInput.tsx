import React, { useState, FunctionComponent } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity
} from "react-native";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { size, fontSize, borderRadius, color } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { AppMode } from "../../context/config";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  inputAndButtonWrapper: {
    marginTop: size(3),
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
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
  searchItemContent: {
    fontFamily: "brand-regular",
    fontSize: fontSize(3)
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
  nationalityInput: {
    borderColor: "black",
    alignSelf: "stretch"
  }
});

const nationalityItems: {
  id: string | number;
  name: string;
  tag?: boolean;
}[] = [
  { id: "A", name: "A", tag: true },
  { id: "AFG", name: "Afghanistan" },
  { id: "ALB", name: "Albania" },
  { id: "DZA", name: "Algeria" },
  { id: "ASM", name: "American Samoa" },
  { id: "AND", name: "Andorra" },
  { id: "AGO", name: "Angola" },
  { id: "ATG", name: "Antigua and Barbuda" },
  { id: "ARG", name: "Argentina" },
  { id: "ARM", name: "Armenia" },
  { id: "AUS", name: "Australia" },
  { id: "AUT", name: "Austria" },
  { id: "AZE", name: "Azerbaijan" },
  { id: "B", name: "B", tag: true },
  { id: "BHS", name: "Bahamas" },
  { id: "BHR", name: "Bahrain" },
  { id: "BGD", name: "Bangladesh" },
  { id: "BRB", name: "Barbados" },
  { id: "BLR", name: "Belarus" },
  { id: "BEL", name: "Belgium" },
  { id: "BLZ", name: "Belize" },
  { id: "BEN", name: "Benin" },
  { id: "BTN", name: "Bhutan" },
  { id: "BOL", name: "Bolivia" },
  { id: "BIH", name: "Bosnia-herzegovina" },
  { id: "BWA", name: "Botswana" },
  { id: "BRA", name: "Brazil" },
  { id: "BRN", name: "Brunei Darussalam" },
  { id: "BGR", name: "Bulgaria" },
  { id: "BFA", name: "Burkina Faso" },
  { id: "BDI", name: "Burundi" },
  { id: "C", name: "C", tag: true },
  { id: "KHM", name: "Cambodia" },
  { id: "CMR", name: "Cameroon" },
  { id: "CAN", name: "Canada" },
  { id: "CPV", name: "Cape Verde" },
  { id: "CAF", name: "Central African Republic" },
  { id: "TCD", name: "Chad" },
  { id: "CHL", name: "Chile" },
  { id: "CHN", name: "China" },
  { id: "COL", name: "Colombia" },
  { id: "COM", name: "Comoros" },
  { id: "COG", name: "Congo" },
  { id: "COK", name: "Cook Islands" },
  { id: "CRI", name: "Costa Rica" },
  { id: "CIV", name: "Cote Divoire" },
  { id: "HRV", name: "Croatia" },
  { id: "CUB", name: "Cuba" },
  { id: "CYP", name: "Cyprus" },
  { id: "CZE", name: "Czech Republic" },
  { id: "D", name: "D", tag: true },
  { id: "PRK", name: "Democratic People's Republic of Korea" },
  { id: "COD", name: "Democratic Republic of Congo" },
  { id: "DNK", name: "Denmark" },
  { id: "DJI", name: "Djibouti" },
  { id: "DMA", name: "Dominica" },
  { id: "DOM", name: "Dominican Republic" },
  { id: "E", name: "E", tag: true },
  { id: "TMP", name: "East Timor" },
  { id: "ECU", name: "Ecuador" },
  { id: "EGY", name: "Egypt" },
  { id: "SLV", name: "El Salvador" },
  { id: "GNQ", name: "Equatorial Guinea" },
  { id: "ERI", name: "Eritrea" },
  { id: "EST", name: "Estonia" },
  { id: "ETH", name: "Ethiopia" },
  { id: "F", name: "F", tag: true },
  { id: "FJI", name: "Fiji" },
  { id: "FIN", name: "Finland" },
  { id: "FRA", name: "France" },
  { id: "G", name: "G", tag: true },
  { id: "GAB", name: "Gabon" },
  { id: "GMB", name: "Gambia" },
  { id: "GEO", name: "Georgia" },
  { id: "D", name: "Germany" },
  { id: "GHA", name: "Ghana" },
  { id: "GRC", name: "Greece" },
  { id: "GRD", name: "Grenada" },
  { id: "GUM", name: "Guam" },
  { id: "GTM", name: "Guatemala" },
  { id: "GIN", name: "Guinea" },
  { id: "GNB", name: "Guinea-bissau" },
  { id: "GUY", name: "Guyana" },
  { id: "H", name: "H", tag: true },
  { id: "HTI", name: "Haiti" },
  { id: "VAT", name: "Holy See (Vatican City State)" },
  { id: "HND", name: "Honduras" },
  { id: "HKG", name: "Hong Kong Sar" },
  { id: "HUN", name: "Hungary" },
  { id: "I", name: "I", tag: true },
  { id: "ISL", name: "Iceland" },
  { id: "IND", name: "India" },
  { id: "IDN", name: "Indonesia" },
  { id: "IRN", name: "Iran" },
  { id: "IRQ", name: "Iraq" },
  { id: "IRL", name: "Ireland" },
  { id: "ISR", name: "Israel" },
  { id: "ITA", name: "Italy" },
  { id: "J", name: "J", tag: true },
  { id: "JAM", name: "Jamaica" },
  { id: "JPN", name: "Japan" },
  { id: "JOR", name: "Jordan" },
  { id: "K", name: "K", tag: true },
  { id: "KAZ", name: "Kazakhstan" },
  { id: "KEN", name: "Kenya" },
  { id: "KIR", name: "Kiribati" },
  { id: "KWT", name: "Kuwait" },
  { id: "KGZ", name: "Kyrgyzstan" },
  { id: "L", name: "L", tag: true },
  { id: "LAO", name: "Laos" },
  { id: "LVA", name: "Latvia" },
  { id: "LBN", name: "Lebanon" },
  { id: "LSO", name: "Lesotho" },
  { id: "LBR", name: "Liberia" },
  { id: "LBY", name: "Libya" },
  { id: "LIE", name: "Liechtenstein" },
  { id: "LTU", name: "Lithuania" },
  { id: "LUX", name: "Luxembourg" },
  { id: "M", name: "M", tag: true },
  { id: "MAC", name: "Macao Sar" },
  { id: "MDG", name: "Madagascar" },
  { id: "MWI", name: "Malawi" },
  { id: "MYS", name: "Malaysia" },
  { id: "MDV", name: "Maldives" },
  { id: "MLI", name: "Mali" },
  { id: "MLT", name: "Malta" },
  { id: "MHL", name: "Marshall Islands" },
  { id: "MRT", name: "Mauritania" },
  { id: "MUS", name: "Mauritius" },
  { id: "MEX", name: "Mexico" },
  { id: "FSM", name: "Micronesia (Federated States of)" },
  { id: "MCO", name: "Monaco" },
  { id: "MNG", name: "Mongolia" },
  { id: "MNE", name: "Montenegro" },
  { id: "MAR", name: "Morocco" },
  { id: "MOZ", name: "Mozambique" },
  { id: "MMR", name: "Myanmar" },
  { id: "N", name: "N", tag: true },
  { id: "NAM", name: "Namibia" },
  { id: "NRU", name: "Nauru" },
  { id: "NPL", name: "Nepal" },
  { id: "NLD", name: "Netherlands" },
  { id: "NZL", name: "New Zealand" },
  { id: "NIC", name: "Nicaragua" },
  { id: "NER", name: "Niger" },
  { id: "NGA", name: "Nigeria" },
  { id: "NIU", name: "Niue" },
  { id: "MNP", name: "Northern Mariana Islands" },
  { id: "NOR", name: "Norway" },
  { id: "O", name: "O", tag: true },
  { id: "OMN", name: "Oman" },
  { id: "P", name: "P", tag: true },
  { id: "PAK", name: "Pakistan" },
  { id: "PLW", name: "Palau" },
  { id: "PAN", name: "Panama" },
  { id: "PNG", name: "Papua New Guinea" },
  { id: "PRY", name: "Paraguay" },
  { id: "PER", name: "Peru" },
  { id: "PHL", name: "Philippines" },
  { id: "POL", name: "Poland" },
  { id: "PRT", name: "Portugal" },
  { id: "PRI", name: "Puerto Rico" },
  { id: "Q", name: "Q", tag: true },
  { id: "QAT", name: "Qatar" },
  { id: "R", name: "R", tag: true },
  { id: "KOR", name: "Republic of Korea" },
  { id: "MDA", name: "Republic of Moldova" },
  { id: "ROU", name: "Romania" },
  { id: "RUS", name: "Russia" },
  { id: "RWA", name: "Rwanda" },
  { id: "S", name: "S", tag: true },
  { id: "KNA", name: "Saint Kitts and Nevis" },
  { id: "LCA", name: "Saint Lucia" },
  { id: "VCT", name: "Saint Vincent and the Grenadines" },
  { id: "WSM", name: "Samoa" },
  { id: "SMR", name: "San Marino" },
  { id: "STP", name: "Sao Tome & Principe" },
  { id: "SAU", name: "Saudi Arabia" },
  { id: "SEN", name: "Senegal" },
  { id: "SGP", name: "Singapore" },
  { id: "SRB", name: "Serbia" },
  { id: "SYC", name: "Seychelles" },
  { id: "SLE", name: "Sierra Leone" },
  { id: "SVK", name: "Slovakia" },
  { id: "SVN", name: "Slovenia" },
  { id: "SLB", name: "Solomon Islands" },
  { id: "SOM", name: "Somalia" },
  { id: "ZAF", name: "South Africa" },
  { id: "SSD", name: "South Sudan" },
  { id: "ESP", name: "Spain" },
  { id: "LKA", name: "Sri Lanka" },
  { id: "SDN", name: "Sudan" },
  { id: "SUR", name: "Suriname" },
  { id: "SWZ", name: "Swaziland" },
  { id: "SWE", name: "Sweden" },
  { id: "CHE", name: "Switzerland" },
  { id: "SYR", name: "Syria" },
  { id: "T", name: "T", tag: true },
  { id: "TWN", name: "Taiwan" },
  { id: "TJK", name: "Tajikistan" },
  { id: "THA", name: "Thailand" },
  { id: "MKD", name: "The Former Yugoslav Republic of Macedonia" },
  { id: "TGO", name: "Togo" },
  { id: "TON", name: "Tonga" },
  { id: "TTO", name: "Trinidad & Tobago" },
  { id: "TUN", name: "Tunisia" },
  { id: "TUR", name: "Turkey" },
  { id: "TKM", name: "Turkmenistan" },
  { id: "TUV", name: "Tuvalu" },
  { id: "U", name: "U", tag: true },
  { id: "UGA", name: "Uganda" },
  { id: "UKR", name: "Ukraine" },
  { id: "ARE", name: "United Arab Emirates" },
  { id: "GBR", name: "United Kingdom" },
  { id: "TZA", name: "United Republic of Tanzania" },
  { id: "USA", name: "United States" },
  { id: "URY", name: "Uruguay" },
  { id: "UZB", name: "Uzbekistan" },
  { id: "V", name: "V", tag: true },
  { id: "VUT", name: "Vanuatu" },
  { id: "VEN", name: "Venezuela" },
  { id: "VNM", name: "Vietnam" },
  { id: "VGB", name: "Virgin Islands (British)" },
  { id: "Y", name: "Y", tag: true },
  { id: "YEM", name: "Yemen" },
  { id: "Z", name: "Z", tag: true },
  { id: "ZMB", name: "Zambia" },
  { id: "ZIM", name: "Zimbabwe" }
];

export interface AlertModalProps {
  alertType: string;
  title: string;
  description: string;
  visible: boolean;
}

export const ListItem: FunctionComponent<{
  title: string;
  isTag: boolean;
  closeModal: () => void;
  onTitleSelection: (title: string) => void;
}> = ({ title, isTag, onTitleSelection }) => {
  return (
    <View style={styles.listItemView}>
      {isTag ? (
        <Text style={styles.listItemTag}>{title}</Text>
      ) : (
        <TouchableOpacity
          onPress={() => {
            onTitleSelection(title);
          }}
        >
          <View style={styles.listItemContent}>
            {/* <Text style={styles.listItemContent}>{title}</Text> */}
            <AppText style={{ marginLeft: size(3) }}>{title}</AppText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const ManualPassportInput: FunctionComponent<{
  idInput: string;
  setIdInput: (id: string) => void;
  submitId: () => void;
}> = ({ idInput, setIdInput, submitId }) => {
  const [alertState, setAlertState] = useState<AlertModalProps>({
    alertType: "unknownType",
    title: "unknownTitle",
    description: "unknownDes",
    visible: false
  });
  const [filterState, setFilterState] = useState<
    { id: string | number; name: string; tag?: boolean }[]
  >(nationalityItems);
  const [selectedTitle, setSelectedTitle] = useState("Select Country");

  const searchFilterFunction = (text: string) => {
    const newData = nationalityItems.filter(item => {
      return item.name.toUpperCase().startsWith(text.toUpperCase());
    });
    setFilterState(newData);
  };

  const closeModal = () => {
    setAlertState({ ...alertState, visible: false });
  };

  const onTitleSelection = (title: string) => {
    setSelectedTitle(title);
    closeModal();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
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

  const renderSearchField = () => {
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

  const renderSeparator = () => {
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
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={alertState.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
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
                  title={item.name}
                  isTag={item.tag || false}
                  closeModal={closeModal}
                  onTitleSelection={onTitleSelection}
                />
              )}
              keyExtractor={item => item.name}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <AppText style={{ fontFamily: "brand-bold" }}>
            {"Country of nationality"}
          </AppText>
          <View
            onTouchStart={() => {
              setAlertState({
                alertType: "unknownType",
                title: "Title",
                description:
                  "confirm a destructive choice sdfjd fldkfj dlfj dlfdkjfl dfj dlfdkj ",
                visible: true
              });
            }}
            style={{
              marginTop: size(1),
              minHeight: size(6),
              borderRadius: borderRadius(2),
              borderWidth: 1,
              backgroundColor: color("grey", 0),
              borderColor: color("blue", 50)
            }}
          >
            <Text
              style={{
                fontFamily: "brand-regular",
                fontSize: fontSize(0),
                marginTop: size(1),
                marginLeft: size(1),
                alignItems: "center",
                color: color("blue", 50)
              }}
            >
              {selectedTitle}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label="Passport number"
            value={idInput}
            onChange={({ nativeEvent: { text } }) => setIdInput(text)}
            onSubmitEditing={submitId}
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType={"default"}
          />
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DarkButton fullWidth={true} text="Submit" onPress={submitId} />
        </View>
      </View>
    </View>
  );
};
