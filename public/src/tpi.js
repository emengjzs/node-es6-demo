$.ajax({
    type: 'GET',
    url: 'api/tpi/info',
    data: {
        s: new Date("2016-08-01 00:00:00").getTime(),
        e: new Date("2016-08-02 00:00:00").getTime()
    }
}).then(res => {
    const ctx = document.getElementById("chart");
    const scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'TPI',
                data: res.data.map((item, i) => ({ x: i / 24 / 60, y: item })),
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });
});