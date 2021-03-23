# Cat Explorer

![thumbnail](#)

Vanilla JS만을 이용해 고양이 사진 탐색기를 구현하기

- [Demo](https://cat-explorer.shj.rip)

## Installation

```sh
yarn global add live-server

git clone https://github.com/Gumball12/cat-explorer.git
cd cat-explorer
live-server # http://localhost:8080/
```

## API

### url

#### 디렉터리 정보

- [./assets/api/root.json](./assets/api/root.json): 루트 디렉터리 탐색 결과 반환
- [./assets/api/단모종-고등어.json](./assets/api/단모종-고등어.json): `단모종-고등어` 디렉터리 탐색 결과 반환

#### 파일

url base: https://raw.githubusercontent.com/Gumball12

- [./assets/image/장모종/장모종-고등어/cat-1.jpg](./assets/image/장모종/장모종-고등어/cat-1.jpg): `장모종/장모종-고등어` 디렉터리에 존재하는 `cat-1.jpg` 이미지 파일 반환

### response body

```ts
[
  {
    id: number,
    name: string,
    type: string,
    path: string | null,
    parentId: number | null,
  },
];
```

- `id`: 요소의 ID
- `name`: 요소의 이름
- `type`: 요소의 타입 (`[FILE|DIRECTORY]`)
- `path`: 요소의 경로 (`type`이 `FILE`일 경우에만 존재, 그 외에는 `null`)
- `parentId`: 상위 요소의 `id` (루트 디렉터리가 아니면서 `type`이 `DIRECTORY`일 경우에만 존재, 그 외에는 `null`)

## LICENSE

- [GPLv3](./LICENSE)
- 이미지는 [Pexels](https://www.pexels.com/) 이용 ([Pexels License](https://www.pexels.com/license/))
- 아이콘은 [Material Icons](https://material.io/resources/icons) 이용 ([Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0.html))
