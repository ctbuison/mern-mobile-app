module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  // Packages in node_modules that ship modern syntax and must be transformed before Node can run them.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|react-redux|@reduxjs/toolkit|immer|redux|reselect|redux-thunk|redux-persist|react-native-paper)',
  ],
};