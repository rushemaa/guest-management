export const weeklyOptions = (pending, inGuest, outGuest) => {
  // console.log(outGuest)

  return {
    title: {
      text: 'Weekly traffic'
    },
    legend: {
      // Try 'horizontal'
      orient: 'horizontal',
      right: 10,
      top: 10
    },
    tooltip: {
      trigger: 'axis'
    },
    // dataZoom: [
    //   {
    //     show: true,
    //     realtime: true,
    //     start: 0,
    //     end: 100,
    //     xAxisIndex: [0, 1]
    //   },
    //   {
    //     type: 'inside',
    //     realtime: true,
    //     start: 0,
    //     end: 100,
    //     xAxisIndex: [0, 1]
    //   }
    // ],
    grid: {
      left: '7%',
      right: '5%',
      bottom: '10%'
    },
    xAxis: {
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    yAxis: {},
    series: [
      {
        name: 'Pending Guest', 
        type: 'bar',
        // sampling: 'lttb',
        clip: true,
        itemStyle: {
          color: '#015c55'
        },
        data: pending
      },
      {
        name: 'In Guest',
        type: 'bar',
        // sampling: 'lttb',
        itemStyle: {
          color: '#EE6666'
        },
        data: inGuest
      },
      {
        name: 'Out Guest',
        type: 'line',
        // sampling: 'lttb',
        itemStyle: {
          color: 'rgb(79, 244, 137)'
        },
        data: outGuest
      }
    ]
  }
}