# Trello Clone

This is a product as the outcome of the course about (pratical) Software Engineering.

Group members

- 1614150 Đặng Tuấn Vũ
- 1610391 Nguyễn Hoài Danh
- 1611017 Lê Thanh Hiếu
- 1611617 Nguyễn Anh Khoa
- 1613587 Vũ Khắc Tình

## Requirements

Node ofcourse. And were using `yarn`.

- gatsby
- eslint
- prettier
- concurrently
- cross-env

```bash
yarn global add eslint gatsby prettier concurrently cross-env
```

## Setup

```bash
yarn install
```

## Run

```bash
# create .env.development file from example
# for development
yarn start
```

By default, a mock server API is run on port 3001. To turn off mock, run `start:nomock`, this expect that a real API server is run, as the app will connect to the API through that server.

## Project structure

This project tries (tried) to immitate [ant-design-pro](https://github.com/ant-design/ant-design-pro), but using another stack.

```
umi   => gatsby + @reach/router
dva   => rematch + rematch-saga
fetch => Axios
antd  => material-ui
```

- src/ contains all the source file
- src/pages contains the pages
- src/layouts contains the layouts used
- src/components contains the components
- src/stage contains the init of redux
- src/models contains the redux store models/reducers/effects
- src/services should contains API calling functions
- src/utils/auth.js contains basic authentication storing and extracting
- src/utils/request.js is the main API calling function

In src/services/, all function export has the form:

```js
import { ENDPOINT } from '@/utils/request';
import { METHOD } from '@/utils/request';
function(endpoint, {data, params, query}) {
  return request(`${ENDPOINT.USER}/${query}`, {
    method: METHOD.GET,
    data,   // post data
    params, // get parameters
  })
}
```

`request` will call the API with the endpoint, using Axios.

## On commit

`eslint` will lint and `prettier` will format before every commit. If any errors occured, fix and commit again.
