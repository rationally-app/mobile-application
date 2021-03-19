import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { InputSelection } from "../../../src/components/CustomerDetails/InputSelection";
import { InputIdSection } from "../../../src/components/CustomerDetails/InputIdSection";
import { ManualPassportInput } from "../../../src/components/CustomerDetails/ManualPassportInput";
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

const InputSelectionItem = (): JSX.Element => {
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

const InputIdSectionItem = (): JSX.Element => {
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

const ManualPassportInputItem = (): JSX.Element => {
  return (
    <View
      style={{
        position: "relative",
        padding: size(2),
        height: "100%",
        width: 512,
        maxWidth: "100%",
      }}
    >
      <ManualPassportInput
        setIdInput={() => null}
        submitId={() => alert("Submitted")}
      />
    </View>
  );
};

storiesOf("CustomerDetail", module)
  .add("InputSelection", () => <InputSelectionItem />)
  .add("InputIdSection", () => <InputIdSectionItem />)
  .add("ManualPassportInput", () => <ManualPassportInputItem />);
