// 格式化数据，添加百分号
function formatData(val) {
  if (!val) return
  return val === "--" ? val : val + "%";
}
export default function format(data) {
  data.failurePct = formatData(data.failurePct);
  data.avgdurPctDay = formatData(data.avgdurPctDay);
  data.avgdurPctMonth = formatData(data.avgdurPctMonth);
  data.avgdurPctWeek = formatData(data.avgdurPctWeek);
  data.calltimesPctDay = formatData(data.calltimesPctDay);
  data.calltimesPctMonth = formatData(data.calltimesPctMonth);
  data.calltimesPctWeek = formatData(data.calltimesPctWeek);
  data.failurePctDay = formatData(data.failurePctDay);
  data.failurePctMonth = formatData(data.failurePctMonth);
  data.failurePctWeek = formatData(data.failurePctWeek);
  data.maxdurPctDay = formatData(data.maxdurPctDay);
  data.maxdurPctMonth = formatData(data.maxdurPctMonth);
  data.maxdurPctWeek = formatData(data.maxdurPctWeek);
  return data
};