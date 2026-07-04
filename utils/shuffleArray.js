/****************************************************************
 * SHUFFLE ARRAY
 * Shuffle the Array
 ****************************************************************/

export const shuffleArray = (array) => {
  const newArray = array.slice();
  var currentIndex = newArray.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }

  return newArray;
};

export default shuffleArray;
