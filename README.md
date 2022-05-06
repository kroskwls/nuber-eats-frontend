# Nuber Eats Frontend

npm i -D tailwindcss postcss autoprefixer

autoprefixer: 호환이 되지않는 속성값을 자동으로 수정하여 적용해준다
ex) firefox에서 border-radius가 호환이 안되는 경우 자동으로 -moz-border-radius로 변경하여 적용

install visual studio code extendtion - tailwind css intellisense

tailwindcss가 적용되지 않는 경우 react-scripts 버전을 "5.0.0-next.58"으로 변경하여 npm i 실행 후 확인

# react-router-dom 6 버전에서는 routing 방법이 바뀌었기 때문에 5.3.0 버전으로 설치

npm i react-router-dom@5.3.0 
npm i --save-dev @types/react-router-dom

npm i react-hook-form

# apollo-tooling
아래 라이브러리 버전과 node v14.18.1로 맞춰야 정상 동작함
"apollo": "^2.33.9",
"graphql": "^15.8.0",

npm i apollo

apollo.config.js 파일 정의
back-end에서 mutations, query responses, input type을 받아와서 typescript 파일로 자동 생성

codegen 실행시 해당 오류가 발생하는 경우
Error: Cannot find module 'graphql/validation/rules/UniqueTypeNames'

# rimraf
npm i rimraf

파일이나 폴더를 삭제해 주는 라이브러리

# react-helmet-async
npm i react-helmet-async

페이지 타이틀을 변경해주는 라이브러리

# fontawesome
npm i --save @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

# unit test tool
npm i mock-apollo-client

# E2E test tools
npm i cypress 
npm i @testing-library/cypree -D


