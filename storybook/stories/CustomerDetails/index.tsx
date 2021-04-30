import React, { useState, ReactElement } from "react";
import { storiesOf } from "@storybook/react-native";
import { InputSelection } from "../../../src/components/CustomerDetails/InputSelection";
import { InputIdSection } from "../../../src/components/CustomerDetails/InputIdSection";
import { InputPassportSection } from "../../../src/components/CustomerDetails/InputPassportSection";
import { size, color } from "../../../src/common/styles";
import { View } from "react-native";
import { IdentificationFlag } from "../../../src/types";

const selectionArray: IdentificationFlag[] = [
  {
    scannerType: "CODE_39",
    type: "STRING",
    validation: "NRIC",
    label: "label_1",
  },
  {
    scannerType: "QR",
    type: "STRING",
    validation: "REGEX",
    label: "label_2",
  },
];

const InputSelectionItem = (): ReactElement => {
  const [currentSelection, setCurrentSelection] = useState<IdentificationFlag>(
    selectionArray[0]
  );
  const onInputSelection = (identificationFlag: IdentificationFlag): void => {
    const selectedValue = selectionArray.find(
      (item) => item.label === identificationFlag.label
    );
    selectedValue && setCurrentSelection(selectedValue);
  };
  return (
    <View
      style={{
        margin: size(3),
        height: "10%",
        backgroundColor: color("grey", 80),
      }}
    >
      <InputSelection
        selectionArray={selectionArray}
        currentSelection={currentSelection}
        onInputSelection={(identificationFlag) =>
          onInputSelection(identificationFlag)
        }
      />
    </View>
  );
};

const InputIdSectionItem = (): ReactElement => {
  const [inputValue, setInputValue] = useState("");
  return (
    <View style={{ margin: size(3) }}>
      <InputIdSection
        openCamera={() => alert("Open camera action")}
        idInput={inputValue}
        setIdInput={(text) => setInputValue(text)}
        submitId={() => alert("Submitted")}
        keyboardType={"default"}
      />
    </View>
  );
};

const InputPassportSectionItem = (): ReactElement => {
  return (
    <View
      style={{
        padding: size(2),
        height: "100%",
      }}
    >
      <InputPassportSection
        scannerType={"NONE"}
        openCamera={() => null}
        setIdInput={() => null}
        submitId={() => alert("Submitted")}
      />
    </View>
  );
};

storiesOf("CustomerDetail", module)
  .add("InputSelection", () => <InputSelectionItem />)
  .add("InputIdSection", () => <InputIdSectionItem />)
  .add("InputPassportSection", () => <InputPassportSectionItem />);
