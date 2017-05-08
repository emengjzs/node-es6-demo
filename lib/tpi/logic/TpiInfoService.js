import math from 'mathjs';
import _ from 'lodash';

import {Smooth} from './../../smooth/smooth';

import Test from './../../model/script/mock-history-data';

const test = new Test();

export default class TpiInfoService {
  async getTpiInfoByTimeRange(from, to) {
    console.log(`Compute tpi from ${from} to ${to}`);


    const fromMinutes = this._getMinutesOfDate(from);
    const toMinutes = this._getMinutesOfDate(to);

    const model = await test.getBusCountIndexModel()      
    const predictTpiSmoothList = model.getIndexData(fromMinutes, toMinutes);
    const actualTpiSmoothList = predictTpiSmoothList;   
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