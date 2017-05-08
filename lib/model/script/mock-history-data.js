import { Smooth } from './../../smooth/smooth';
import _ from 'lodash';
import math from 'mathjs';


function normalize(arr) {
  const minVal = math.min(arr);
  const maxVal = math.max(arr);
  return arr.map(v => (v - minVal) / (maxVal - minVal));
}

export default class MockHistoryDataGenerator {
  
  generateHistoryData(sampleDataList) {
    const fromMinutes = 0;
    const toMinutes = 12 * 24;
    const SmoothFunction = Smooth(
        sampleDataList,
        {clip: Smooth.CLIP_PERIODIC, scaleTo: [fromMinutes, toMinutes]});
    const smoothDataList =
        _.fill(Array(toMinutes - fromMinutes + 1), 0)
            .map((v, i) => SmoothFunction(fromMinutes + i));
    return smoothDataList;
  }
  
  generatePredictData(sampleDataList) {
    const maxSourceData = math.max(sampleDataList); 
    mockPredictData.map(
        // N ~ (0, 1)
        v => math.min(1, v * (1 + math.random(-0.3, 0.3)) / maxSourceData));
  }
  
};