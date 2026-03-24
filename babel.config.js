module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Must be listed last as required by react-native-reanimated.
      'react-native-reanimated/plugin',
    ],
  };
};

