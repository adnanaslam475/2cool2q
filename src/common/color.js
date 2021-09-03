/**
 * Color Palette Define
 */

let OrangeColor = {
  primaryColor: "#E5634D",
  darkPrimaryColor: "#C31C0D",
  lightPrimaryColor: "#FF8A65",
  accentColor: "#4A90A4",
};

/**
 * Main color use for whole application
 */
let BaseColor = {
  ...OrangeColor,
  ...{
    primaryBlueColor: "#0d97df",
    whiteColor: "#FFFFFF",
    grayColor: "#9B9B9B",
    lightGrey: "#D3D3D3",
    darkGrey: "#606060",
    borderColor: "#6d625d",
    textColor: "#342a24",
    blackColor: "#000",
    redColor: "#f00",
    mainBackground: "#FCFCFC",
    sideMenuBackGround: "#EFEFEF",
  },
};

export { BaseColor, OrangeColor };
