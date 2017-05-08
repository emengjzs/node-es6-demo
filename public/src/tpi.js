$.ajax({
   type: 'GET',
   url: 'api/tpi/info',
   data: {
     s: new Date('2016-08-01 06:00:00').getTime(),
     e: new Date('2016-08-01 12:00:00').getTime()
   }
 }).then(res => {
  const ctx = document.getElementById('chart');
  const scatterChart = new Chart(ctx, {
    type: 'line',
    
    data: {
      datasets: [
        {
          label: 'Predict',
          data: res.data.predictTpiSmoothList.map(
              (item, i) => ({x: i / 12, y: item})),
        },
        {
          label: 'Actual',
          data: res.data.actualTpiSmoothList.map(
              (item, i) => ({x: i / 12, y: item}))
        }
      ]
    },
    options: {
      scales: {
         yAxes: [{
                ticks: {
                    min: 0,
                }
            }],
        xAxes: [{ type: 'linear', position: 'bottom' }]
      }
    }
  });
});