import { createContext, useEffect, useId, useState } from "react";
import "./app.css";
import { Accordion } from "./component/accordion";
import { ChartContainer } from "./component/chart";
import { DATA_REPEAT, TIME_REPEAT } from "./const/const";
import { openJSON } from "./util/open-json";
import { repeatArray } from "./util/repeat-array";

const jsonFiles = {
  data1: () => import("./data1.json"),
  data2: () => import("./data2.json"),
};

interface DataType {
  original: null | object;
  repeated: null | unknown[][];
}

export const JsonContext = createContext<DataType>({
  original: null,
  repeated: null,
});

function App() {
  const [jsonData, setJsonData] = useState<DataType>({
    original: null,
    repeated: null,
  });
  const [fileSize, setFileSize] = useState("0");
  const selectId = useId();

  const handleDataFromName = async (fileName: keyof typeof jsonFiles) => {
    if (jsonFiles[fileName]) {
      const module = await jsonFiles[fileName]();
      const json = module.default;

      const jsonString = JSON.stringify(json);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);

      setJsonData({
        original: json,
        repeated: repeatArray(Object.values(json), DATA_REPEAT),
      });
      setFileSize(sizeInKB);
    }
  };

  useEffect(() => {
    handleDataFromName("data1");
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const fileName = event.target.value as keyof typeof jsonFiles;
    await handleDataFromName(fileName);
  };

  return (
    <main className="main-container">
      <h1>개요</h1>
      <p>미분과 여러 바이너리 인코딩에 대한 시간 메트릭 부하 테스트</p>
      <h1>테스트 방식</h1>
      <p>자체적으로 부하를 준 tldraw record를 사용</p>
      <label htmlFor={selectId}>데이터 선택: </label>
      <select onChange={handleFileSelect} defaultValue="data1" id={selectId}>
        <option value="data1">data1.json</option>
        <option value="data2">data2.json</option>
      </select>
      <p>
        원본 파일은 {fileSize}kb이고 해당 json object에서 value를 취한 배열을 {DATA_REPEAT}번 반복해 늘린
        데이터로 테스트
      </p>
      <p>해당 데이터로 {TIME_REPEAT}번 시간 측정</p>
      <ul>
        <li>
          <a
            onClick={(e) => {
              e.preventDefault();
              if (jsonData !== null) {
                openJSON(jsonData);
              }
            }}
          >
            테스트 데이터 내용 확인
          </a>
        </li>
      </ul>
      <h2>환경 세팅</h2>
      <h3>시간 측정</h3>
      <p>
        <a href="https://nodejs.org/docs/latest-v22.x/api/globals.html#performance">
          퍼포먼스
        </a>
        를 이용해 측정
      </p>
      <p>
        압축 알고리즘뿐만 아니라 문자열화 등의 작업이 필요하면 시간 측정에 포함
      </p>
      <p>
        {"performance.now => 함수 실행(JSON처리) => performance.end"}로 ms
        단위의 시간 차이 {TIME_REPEAT}번 측정
      </p>
      <h3>용량 측정</h3>
      <p>결과값은 바이트 단위의 용량 측정</p>
      <p>
        .length 메서드가 가능한 경우 그대로 사용, 아니라면 문자열로 변환 뒤
        UTF-8인코딩해 바이트 측정
      </p>
      <Accordion title="변수 목록">
        <h3>통제 변수 (default)</h3>
        <p>두 인덱스 중 하나 그대로 리턴</p>
        <h3>JSON.stringify</h3>
        <p>JSON을 문자열 변환한 시간(일부 테스트케이스는 해당 과정이 필수)</p>
        <h3>미분 (differential)</h3>
        <p>두 인덱스를 비교해 변화값 리턴</p>
        <h3>msgpack 인코딩</h3>
        <p>msgpack을 이용한 바이너리 인코딩</p>
        <h3>BSON 인코딩</h3>
        <p>BSON을 이용한 바이너리 인코딩</p>
        <h3>CBOR-X 인코딩</h3>
        <p>기존 CBOR을 개선한 CBOR - X을 이용한 바이너리 인코딩</p>
        <h3>ProtoBuff 인코딩</h3>
        <p>정확한 스키마를 지정해줘야 동작, 따라서 사용하기에 부적절</p>
        <p>
          동적인 스키마를 지정할 수 있으나 이 역시도 필드와 데이터 형식을
          지정해야함
        </p>
        <p>왜냐하면 디코딩시 스키마를 기반으로 디코딩하기 때문</p>
        <h3>PAKO 압축</h3>
        <p>
          Zlib 포맷을 사용하는 Deflate/Inflate JSON 압축 및 압축 해제 구현체
        </p>
        <h3>differential + PAKO 압축</h3>
        <p>
          미분한 결과를 PAKO 압축
        </p>
        <h3>compress-json 압축</h3>
        <p>네트워크 대역폭 및 디스크 용량을 줄이기 위한 JSON 압축 알고리즘</p>
        <h3>lz-string 압축</h3>
        <p>lz 기반 문자열 압축 알고리즘</p>
      </Accordion>
      <JsonContext.Provider value={jsonData}>
        <ChartContainer />
      </JsonContext.Provider>
    </main>
  );
}

export default App;
