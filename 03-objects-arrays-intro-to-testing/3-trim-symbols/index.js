/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  if(size === 0){
    return '';
  }

  const firstPart = string.slice(0, size);
  const strRest = [...string.slice(size)];
  
  return strRest.reduce(function (strAccum, currChar) {
    if(!strAccum.endsWith(currChar.repeat(size))){
      strAccum += currChar;
    }
    return strAccum;
  }, firstPart);
}
