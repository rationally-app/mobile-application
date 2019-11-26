import { Document } from "@govtechsg/open-attestation";
import { validateAction } from "./actionValidator/validator";
import { DocumentPermittedAction } from "./actionValidator/documentActionValidator";

// The universal transfer method uses the query string's field as the action type
// and the uriencoded value as the payload
const universalTransferDataRegex = /https:\/\/openattestation.com\/action\?(.*)=(.*)/;

export enum ActionType {
  DOCUMENT = "DOCUMENT"
}

export interface Action {
  type: string;
  payload: {
    uri: string;
    key?: string;
    permittedActions?: DocumentPermittedAction[];
    redirect?: string;
  };
}

export const decodeAction = (data: string): Action => {
  if (!universalTransferDataRegex.test(data)) {
    throw new Error("Invalid QR Protocol");
  }
  try {
    const actionType = data.match(universalTransferDataRegex)![1].toUpperCase();
    const encodedPayload = data.match(universalTransferDataRegex)![2];
    const decodedPayload = JSON.parse(decodeURI(encodedPayload));
    validateAction(actionType, decodedPayload);
    return {
      type: actionType,
      payload: decodedPayload
    };
  } catch (e) {
    throw new Error(`Invalid QR Action: ${e.message}`);
  }
};

export interface QrHandler {
  onDocumentStore: (fetchedDocument: Document) => void | Promise<void>;
  onDocumentView: (fetchedDocument: Document) => void | Promise<void>;
}

export const processQr = async (
  data: string,
  { onDocumentStore, onDocumentView }: QrHandler
): Promise<void> => {
  const action = decodeAction(data);

  switch (action.type) {
    case ActionType.DOCUMENT:
      const fetchedDocument = (await fetch(action.payload.uri).then(res =>
        res.json()
      )) as Document;
      // TODO Validate if fetchedDocument is a valid document, need to add the method to open-attestation
      if (
        action.payload.permittedActions &&
        action.payload.permittedActions.includes(DocumentPermittedAction.STORE)
      ) {
        await onDocumentStore(fetchedDocument);
      } else {
        await onDocumentView(fetchedDocument);
      }
      break;
    default:
      throw new Error("Invalid QR Action");
  }
};
