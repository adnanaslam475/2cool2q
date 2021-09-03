module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [
          ".ts",
          ".tsx",
          ".js",
          ".jsx",
          ".android.tsx",
          ".android.js",
          ".ios.tsx",
          ".ios.js",
        ],
        root: ["./src"],
      },
    ],
  ],
};
