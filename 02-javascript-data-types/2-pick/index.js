/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const resObj = {};

  for (const [key] of Object.entries(obj)) {
    if(fields.includes(key)){
      resObj[key] = obj[key];
    }
  }
  return resObj;
};
