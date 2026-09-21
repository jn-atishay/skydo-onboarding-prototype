import { Options, SearchTag } from "../types/atomicComponentTypes";

type SearchOutput = {
  [key: string]: number;
};
export const searchByTags = (searchInput: string, documents: SearchTag[][]) => {
  return documents.reduce((docMatchList, doc, currentIndex) => {
    docMatchList[String(currentIndex)] = doc.reduce((matchedWeight, searchTag) => {
      if (searchTag.term.includes(searchInput)) return matchedWeight + searchTag.weight;
      return matchedWeight;
    }, 0);
    return docMatchList;
  }, {} as SearchOutput);
};

const convertOptionsIntoSearchDocument = (options: Options) => {
  return options.reduce((document, option) => {
    const optionSearchDoc: SearchTag[] = [{ term: option.label?.toLowerCase(), weight: 3 }];
    if (option.subText) optionSearchDoc.push({ term: option.subText.toLowerCase(), weight: 2 });
    if (option.searchTags) optionSearchDoc.push(...option.searchTags);
    document.push(optionSearchDoc);
    return document;
  }, [] as SearchTag[][]);
};
export const dropdownOptionsFilter = (textInput: string = "", options: Options = []) => {
  const searchDoc = convertOptionsIntoSearchDocument(options);
  /*
  In Search doc
    every option converted to document.
    a document is a list of collection of search tags
   */
  const inputTextInTags = textInput
    .split(" ")
    .map((text) => text.trim().toLowerCase())
    .filter((text) => text);
  if (!inputTextInTags.length) return options;

  const optionsMatchedWeights = inputTextInTags.reduce((optionsMatchForAllSplittedInputs, inputText) => {
    /*
      matchedWeightsInAllOptions option to matched weights for a single input tag
      optionsMatchForAllSplittedInputs option to matched weights for all input tags which after return is optionsMatchedWeights
     */
    const matchedWeightsInAllOptions = searchByTags(inputText, searchDoc);
    Object.keys(matchedWeightsInAllOptions).forEach((optionIndex) => {
      optionsMatchForAllSplittedInputs[optionIndex] =
        (optionsMatchForAllSplittedInputs[optionIndex] || 0) + matchedWeightsInAllOptions[optionIndex];
    });
    return optionsMatchForAllSplittedInputs;
  }, {} as SearchOutput);

  const list = Object.keys(optionsMatchedWeights)
    .map((optionIndex) => ({
      index: optionIndex,
      weight: optionsMatchedWeights[optionIndex],
      isFixed: options[Number(optionIndex)].fixedOption,
    }))
    .filter((option) => option.weight || option.isFixed);

  list.sort((a, b) => b.weight - a.weight);

  return list.reduce((sortedOptions, option) => {
    sortedOptions.push(options[Number(option.index)]);
    return sortedOptions;
  }, [] as Options);
};
