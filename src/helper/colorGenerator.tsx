import { isString } from "lodash";

const componentToHex = (c: number) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const colorGenerator = (
  color: string | { r: number; g: number; b: number },
  numShades: number
) => {
  const colorCode = { r: 0, g: 0, b: 0 };
  if (isString(color)) {
    const hexValue = color.replace("#", "");
    colorCode.r = parseInt(hexValue.substring(0, 2), 16);
    colorCode.g = parseInt(hexValue.substring(2, 4), 16);
    colorCode.b = parseInt(hexValue.substring(4, 6), 16);
  }

  const { r, g, b } = colorCode;
  const shades = [];

  for (let i = 0; i < numShades; i++) {
    const shadeFactor = i / (numShades - 1);
    const newR = Math.round(r + (255 - r) * shadeFactor);
    const newG = Math.round(g + (255 - g) * shadeFactor);
    const newB = Math.round(b + (255 - b) * shadeFactor);

    const newHex =
      "#" + componentToHex(newR) + componentToHex(newG) + componentToHex(newB);
    shades.push(newHex);
  }

  return shades;
};

export default colorGenerator;
