import {
  Smooth
} from './../../smooth/smooth';
import _ from 'lodash';
import math from 'mathjs';
import fs from 'fs';
import Papa from 'babyparse';

function normalize(arr) {
  const minVal = math.min(arr);
  const maxVal = math.max(arr);
  return arr.map(v => (v - minVal) / (maxVal - minVal));
}

const filename = './lib/model/data/bus-count';

async function loadDataFromFile(filename) {
  return new Promise((res, rej) => {
    fs.readFile(filename + '.csv', 'utf8', (err, csv) => {
      if (err) {
        rej(err);
      } else {
        const data = Papa.parse(csv, {
          skipEmptyLines: true, dynamicTyping: true
        });
        res(data.data.map(v => v[0]));
      }
    });
  });
}

const secondsInDay = 86400;

class BaseIndexModel {
  constructor(config) {
    this._name = config.name || '';
    this._indexList = [];
    this._sampleDataList = [];
    this._timeunit = config.timeunit || 60;    // 60s (1min)
    this._indexFunction = null;
    this._standardize = config.standardize || (x => math.round(x));
  }

  async loadData() {
    this._sampleDataList = await loadDataFromFile(this._name);
    this._smooth();
  }

  _smooth() {
    const from = 0;
    const to = math.floor(secondsInDay / this._timeunit);
    const smoothFunction = Smooth(
      this._sampleDataList, { /* clip: Smooth.CLIP_PERIODIC ,*/ scaleTo: [from, to] });
    
    // idx : from(0) ~ to (86400 / 60)
    this._indexFunction = idx => this._standardize(smoothFunction(from + idx));

    // soomth first time
    this._indexList =
      _.fill(Array(to - from + 1), 0)            // new array[n]
        .map((v, i) => this._indexFunction(i));  // fill with values, startardize each value
  }

  // from, to : 0 ~ 86400 / _timeunit(60)
  getIndexData(from, to) {
    return _.slice(this._indexList, from, to + 1);
  }
}

export default class IndexModel {
  constructor() {
    this._busCountIndexModel = null;
  }

  async getBusCountIndexModel() {
    if (this._busCountIndexModel == null) {
      this._busCountIndexModel = await this.loadIndexModel({
        name: './lib/model/data/bus-count',
        timeunit: 60,
        standardize: x => math.round(x),
      });
    }
    return this._busCountIndexModel;
  }  

  async loadIndexModel(config) {
    const model = new BaseIndexModel(config);
    await model.loadData();
    return model;
  }
}


// export default class MockHistoryDataGenerator {

  // generateHistoryData(sampleDataList) {
  //   const fromMinutes = 0;
  //   const toMinutes = 12 * 24;
  //   const SmoothFunction = Smooth(
  //       sampleDataList,
  //       {clip: Smooth.CLIP_PERIODIC, scaleTo: [fromMinutes, toMinutes]});
  //   const smoothDataList =
  //       _.fill(Array(toMinutes - fromMinutes + 1), 0)
  //           .map((v, i) => SmoothFunction(fromMinutes + i));
  //   return smoothDataList;
  // }

//   generatePredictData(sampleDataList) {
//     const maxSourceData = math.max(sampleDataList); 
//     mockPredictData.map(
//         // N ~ (0, 1)
//         v => math.min(1, v * (1 + math.random(-0.3, 0.3)) / maxSourceData));
//   }

// };