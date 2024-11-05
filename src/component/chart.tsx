import { useContext, useEffect, useState } from "react";
import { defaultFunc } from "../experiment/default-func";
import { differentialFunc } from "../experiment/differential-func";
import { msgpackFunc } from "../experiment/msgpack-func";
import { cborXFunc } from "../experiment/cbor-x-func";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRepeatTime } from "../util/get-time";
import { getByteSize } from "../util/get-byte-size";
import { pakoFunc } from "../experiment/pako-func";
import { bsonFunc } from "../experiment/bson-func";
import { compressJSONFunc } from "../experiment/compress-json-func";
import { lzStringFunc } from "../experiment/lz-string-func";
import { differentialPakoFunc } from "../experiment/differential-pako-func";
import { stringifyFunc } from "../experiment/stringify-func";
import { JsonContext } from "../app";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type funcElementType = { name: string; fn: (arr: unknown[][]) => void };

const liteFuncArr: funcElementType[] = [
  { name: "기본값", fn: defaultFunc },
  { name: "자체 제작", fn: differentialFunc },
  { name: "msgpack", fn: msgpackFunc },
  { name: "cbor-X", fn: cborXFunc },
  { name: "JSON.stringify", fn: stringifyFunc },
];

const heavyFuncArr: funcElementType[] = [
  { name: "기본값", fn: defaultFunc },
  { name: "자체 제작", fn: differentialFunc },
  { name: "pako", fn: pakoFunc }, // to slow
  { name: "bson", fn: bsonFunc }, // to slow
  { name: "compress-JSON", fn: compressJSONFunc }, // so silly
  { name: "lz-string", fn: lzStringFunc },
  { name: "diffential + pako", fn: differentialPakoFunc },
];

export const ChartContainer = () => {
  const [isChecked, setIsChecked] = useState(false);
  const curFuncArr = isChecked ? [...heavyFuncArr] : [...liteFuncArr];
  const {original:originalData,repeated:repeatedArr} = useContext(JsonContext)
  if (originalData === null || repeatedArr === null) {
    return <h1>데이터 불러오는 중 ...</h1>
  }
  return (
    <>
      <h1>종합 결과</h1>
      <h2>시간 (반복 JSON)</h2>
      <p style={{ fontWeight: "bold", color: "#420505" }}>
        ⚠️ 이것은 당신의 브라우저를 망가뜨릴 수 있습니다.
      </p>
      <p style={{ fontSize: "0.75rem", opacity: 0.75 }}>
        비교를 위해 default & differential이 포함됩니다.
      </p>
      <label htmlFor="check" className="click-able">
        <input
          type="checkbox"
          id="check"
          onChange={(e) => {
            setIsChecked(e.target.checked);
          }}
          checked={isChecked}
        />
        느린 것 포함
      </label>

      <EachChart
        title="시간 비교"
        yTitle="시간 (ms)"
        callback={getRepeatTime}
        funcArr={curFuncArr}
        arr={repeatedArr}
      />
      <h2>용량 (원본 JSON)</h2>
      <EachChart
        title="용량 비교"
        yTitle="용량 (byte)"
        callback={getByteSize}
        arr={Object.values(originalData)}
        funcArr={curFuncArr}
      />
    </>
  );
};

const EachChart = ({
  title,
  yTitle,
  callback,
  arr,
  funcArr,
}: {
  title: string;
  yTitle: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (fn: () => any) => number[];
  arr: unknown[][];
  funcArr: funcElementType[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<null | {
    labels: number[];
    datasets: {
      label: string;
      data: unknown;
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  }>(null);
  useEffect(() => {
    setIsLoading(true);
    const obj: { [key in string]: number[] } = {};
    funcArr.forEach((e) => {
      obj[e.name] = callback(() => e.fn(arr)); // getRepeatTime(() => e.fn(repeatedArray));
    });
    setIsLoading(false);
    const datasets = Object.keys(obj).map((key, index) => ({
      label: key,
      data: obj[key],
      fill: false,
      borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
      tension: 0.1,
    }));
    const labels = Array.from({ length: datasets[0].data.length }, (_, i) => i);
    setData({
      labels: labels,
      datasets: datasets,
    });
  }, [arr, callback, funcArr]);
  return (
    <div className="chart-container">
      {isLoading || data === null ? (
        <h2>로딩...</h2>
      ) : (
        <Line
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: title,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "시행 횟수",
                },
              },
              y: {
                title: {
                  display: true,
                  text: yTitle,
                },
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};
