// const { transform } = require("lodash");

module.exports = {


  // 파일 확장자를 지정하지 않은 경우, Jest가 검색할 확장자 목록입니다.
  // E.g. 'import HelloWorld from '~/components/HelloWorld';'
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx'],
  // '~' 같은 경로 별칭을 매핑한다.
  // '<rootDir> ' 토큰을 사용해 루트 경로를 참조할 수 있습니다.
  // E.g. 'import HelloWorld from '~/components/HelloWorld';'
 moduleNameMapper: {
   '^~/(.*)$' : '<rootDir>/src/$1'
 },
// 테스트를 제외하는 것 
// 일치하는 경로에서는 모듈을 가져오지 않습니다. 

 modulePathIgnorePatterns: [
   '<rootDir>/node_modules',
   '<rootDir>/dist',
   '<rootDir>/cypress'
 ],
 testEnvironment: 'jsdom',

// jsdom 환경에 대한 URL 을 설정한다. 

 testURL: 'http://localhost',

 // 정규식과 일치하는 파일의 변환 모듈을 지정합니다.
 transform: {
   '^.+\\.vue$': 'vue3-jest',
   '^.+\\.js$': 'babel-jest',
 }

}