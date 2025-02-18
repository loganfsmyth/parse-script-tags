import * as types from "@babel/types";
import * as parser from "@babel/parser";

import {
  generateWhitespace,
  getCandidateScriptLocations,
  parseScripts as customParseScripts,
  parseScriptTags as customParseScriptTags
} from "./customParse.js";


function parseScript({source, line}) {
  // remove empty or only whitespace scripts
  if (source.length === 0 || /^\s+$/.test(source)) {
    return null;
  }

  try {
    return parser.parse(source, {
      sourceType: "script",
      startLine: line
    });
  } catch (e) {
    return null;
  }
}

function parseScripts (locations, parser = parseScript) {
  return customParseScripts(locations, parser);
}

function extractScriptTags(source) {
  return parseScripts(
    getCandidateScriptLocations(source),
    loc => {
      const ast = parseScript(loc);

      if (ast) {
        return loc;
      }

      return null;
    }
  ).filter(
    types.isFile
  );
}

function parseScriptTags (source, parser = parseScript) {
  return customParseScriptTags(source, parser);
}


export default parseScriptTags;
export {
  extractScriptTags,
  generateWhitespace,
  getCandidateScriptLocations,
  parseScript,
  parseScripts,
  parseScriptTags
};
