import shuffleArray from "@scripts/shuffleArray";

/****************************************************************
 * CALCULATE BALLS
 * Calculates the location of the balls
 ****************************************************************/
export function calculateBalls(kids) {
  const maxLines = 32;
  let currentLine = 1;
  let pos = 0;
  const newBalls = [];

  let num = Math.ceil((kids.filter((kid) => kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful)).length / 2000) * 148);
  const positions = shuffleArray(Array.from(Array(148).keys()));
  for (let i = 0; i < 148 && currentLine < maxLines; i++) {
    const maxBalls = Math.ceil((currentLine / maxLines) * 10);
    let max = (90 * maxBalls) / 10;
    if (currentLine < 3) max = max - (3 - currentLine) * 2;
    let left = 50 - max / 2 + (pos / maxBalls) * max - 5;
    if (currentLine > 4) left = left - 2 + Math.random() * 4;
    const top = (currentLine / maxLines) * 90 + 5;
    const rand = Math.floor(Math.random() * 30 + 1);
    const size = 50 + Math.random() * 20;
    const zindexArray = [100, 100, 100, 90, 90, 90, 80, 80, 80, 70, 70, 70, 60, 60, 60, 60, 50, 50, 50, 40, 40, 40, 30, 30, 30, 30];
    let zindex = zindexArray[currentLine - 1];
    if (positions[i] < num) {
      newBalls.push({
        x: left,
        y: top,
        image: `/kugel${rand}.png`,
        size: size,
        zindex: zindex,
        animation: "animation" + Math.ceil(Math.random() * 3),
      });
    }
    if (pos === maxBalls) {
      currentLine += 1;
      pos = 0;
    } else {
      pos += 1;
    }
  }
  return newBalls;
}
