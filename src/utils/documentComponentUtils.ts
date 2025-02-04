import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";

export const createLink = (
  title: string,
  text: string
): DocumentComponentDto => ({
  type: DocumentComponentType.LINK,
  title,
  texts: [text.trim()],
});
export const createParagraphWithTitle = (
  title: string,
  ...texts: string[]
): DocumentComponentDto => ({
  type: DocumentComponentType.PARAGRAPH,
  title,
  texts,
});
export const createParagraph = (...texts: string[]): DocumentComponentDto => ({
  type: DocumentComponentType.PARAGRAPH,
  texts,
});
export const createHeaderH1 = (text: string): DocumentComponentDto => ({
  type: DocumentComponentType.HEADER_H1,
  texts: [text],
});

export const createHeaderH2 = (text: string): DocumentComponentDto => ({
  type: DocumentComponentType.HEADER_H2,
  texts: [text],
});

export const getHeaderText = (
  document: DocumentComponentDto[],
  type:
    | DocumentComponentType.HEADER
    | DocumentComponentType.HEADER_H1
    | DocumentComponentType.HEADER_H2
): string => {
  const header = document.find((component) => component.type === type);
  return header?.texts[0] ?? "";
};
