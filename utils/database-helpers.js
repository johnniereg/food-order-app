/*
 * General utility functions to help with the database
 */

// creates a random id
const generateRandomString = () => {
  let resultString = '';
  let characters = 'abcdefhijklmnopqrstuvwxyz';
  characters += characters.toUpperCase() + '1234567890';
  while(resultString.length < 6){
    const charIndex = Math.floor(Math.random() * characters.length);
    resultString += characters[charIndex];
  }
  return resultString;
};

module.exports = {
  generateRandomString
};
