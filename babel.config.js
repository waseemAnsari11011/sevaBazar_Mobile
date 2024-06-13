module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": true,
      "allowUndefined": true
    }], 'react-native-reanimated/plugin', 'react-native-paper/babel', 
  ],

};
