import { DocumentItem } from "../../../src/components/DocumentList/DocumentList";

export const documents: DocumentItem[] = [
  { id: "#1", title: "UAPL", isVerified: true },
  {
    id: "#2",
    title:
      "Bachelor of Biological Sciences with a Second Major in Medicinal Chemistry and Pharmacology",
    isVerified: false
  },
  {
    id: "#3",
    title: "Bachelor of Computer Science",
    isVerified: false,
    lastVerification: Date.now()
  }
];
