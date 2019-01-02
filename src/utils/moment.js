import moment from "moment";
// n 为天数，返回当前时间和n天后的数组
export default function time(n) {
  let today = moment().format("YYYY-MM-DD");
  return [moment(today).add(n, "days").format("YYYY-MM-DD"), today] // [当天, n天后]
}