import { PolicyIdentifier, CampaignPolicy } from "../../types";

export const defaultIdentifier: PolicyIdentifier = {
  label: "identifier",
  textInput: { visible: true, disabled: false, type: "STRING" },
  scanButton: { visible: true, disabled: false, type: "BARCODE" }
};

export const defaultProducts: CampaignPolicy[] = [
  {
    category: "toilet-paper",
    name: "Toilet Paper",
    description: "",
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " roll"
      }
    },
    identifiers: [
      {
        ...defaultIdentifier,
        label: "first"
      },
      {
        ...defaultIdentifier,
        label: "last"
      }
    ]
  },
  {
    category: "chocolate",
    name: "Chocolate",
    order: 2,
    quantity: {
      period: 7,
      limit: 15,
      default: 0,
      unit: {
        type: "POSTFIX",
        label: "bar"
      }
    },
    identifiers: [
      {
        ...defaultIdentifier,
        label: "first"
      },
      {
        ...defaultIdentifier,
        label: "last"
      }
    ]
  }
];

export const defaultAppealProducts: CampaignPolicy[] = [
  {
    category: "toilet-paper",
    name: "Toilet Paper",
    description: "",
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " roll"
      }
    },
    identifiers: [
      {
        ...defaultIdentifier,
        label: "first"
      },
      {
        ...defaultIdentifier,
        label: "last"
      }
    ]
  }
];
