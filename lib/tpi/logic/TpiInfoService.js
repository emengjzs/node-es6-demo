import math from 'mathjs';
import _ from 'lodash';

import {Smooth} from './../../smooth/smooth';

export default class TpiInfoService {
  async getTpiInfoByTimeRange(from, to) {
    console.log(`Compute tpi from ${from} to ${to}`);


    const fromMinutes = this._getMinutesOfDate(from);
    const toMinutes = this._getMinutesOfDate(to);
    const mockTpiSourceData =
        [1, 5, 8, 12, 25, 27, 20, 18, 24, 16, 12, 8, 15, 17, 26];
    const maxSourceData = math.max(mockTpiSourceData);

    let tpiPredictSampleList = mockTpiSourceData.map(v => v / maxSourceData);
    let tpiActualSampleList = mockTpiSourceData.map(
        // N ~ (0, 1)
        v => math.min(1, v * (1 + math.random(-0.3, 0.3)) / maxSourceData));

    const predictSmoothFunction = Smooth(
        tpiPredictSampleList,
        {clip: Smooth.CLIP_PERIODIC, scaleTo: [fromMinutes, toMinutes]});

    const actualSmoothFucntion = Smooth(
        tpiActualSampleList,
        {clip: Smooth.CLIP_PERIODIC, scaleTo: [fromMinutes, toMinutes]});

    let predictTpiSmoothList =
        _.fill(Array((toMinutes - fromMinutes) / 5 + 1), 0)
            .map((v, i) => predictSmoothFunction(fromMinutes + 5 * i));

    predictTpiSmoothList = this._getNormalize(predictTpiSmoothList);

    let actualTpiSmoothList =
        _.fill(Array((toMinutes - fromMinutes) / 5 + 1), 0)
            .map((v, i) => actualSmoothFucntion(fromMinutes + 5 * i));
    actualTpiSmoothList = this._getNormalize(actualTpiSmoothList);

    return {predictTpiSmoothList, actualTpiSmoothList};
  }


  _getMinutesOfDate(date) { return date.getHours() * 60 + date.getMinutes(); }

  _getArrayByRange(from, to) {
    const array = Array.from(new Array(to - from + 1), (x, i) => i + from);
    return array;
  }

  _getIndexByMinutes(minutes) {
    // 2pi / x = 24  -> x = 2pi / 24
    return Math.abs(Math.sin((minutes / 60) * (2 * Math.PI) / 24) * 7);
  }

  _isSameDate(date1, date2) {
    return parseInt(date1.getTime() / (1000 * 60 * 60 * 24)) ===
        parseInt(date2.getTime() / (1000 * 60 * 60 * 24));
  }

  _getExclusiveIntervalDays(fromDate, toDate) {
    const dateAfterFromDate =
        Math.floor(fromDate.getTime() / (1000 * 60 * 60 * 24)) + 1;
    const truncateDateOftoDate =
        Math.floor(toDate.getTime() / (1000 * 60 * 60 * 24));
    return Math.max(0, truncateDateOftoDate - dateAfterFromDate);
  }

  _getNormalize(arr) {
    const minVal = math.min(arr);
    const maxVal = math.max(arr);
    return arr.map(v => (v - minVal) / (maxVal - minVal));
  }
}