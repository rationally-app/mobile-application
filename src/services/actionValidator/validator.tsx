import {
  validateDocumentAction,
  DocumentAction
} from "./documentActionValidator";

export enum ActionType {
  DOCUMENT = "DOCUMENT"
}

export const validateAction = ({
  type,
  payload
}: {
  type: string;
  payload: any;
}): DocumentAction => {
  switch (type) {
    case ActionType.DOCUMENT:
      return validateDocumentAction(payload);
    default:
      throw new Error("Unsupported action type");
  }
};
