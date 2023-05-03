import { Component, OnInit } from '@angular/core';
import {Chart, ChartDataSets} from 'chart.js';
import 'chartjs-plugin-annotation';
import  { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css']
})

export class FinalComponent implements OnInit {
  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  public wedChart;
  public thurChart;
threshold: any;
threshold2: any;
userProfile: any;
  userData: any;
headers = {Authorization : "Token " + "0QDNtX8szxHiJ6xDMFGJpZLh03lWQaLD"}
userDataUrl:any;
email:any;
url: any;
url2: any;
agpData: any;
agpPlotData: any;
dataExists: any;
fulluserdata :any;
glucoseData: any;
lendata: any;   
chartdata: ChartDataSets[] = [{
  borderColor: "#6bd098",
  backgroundColor: "#ffffff",
  pointRadius: 0,
  pointHoverRadius: 0,
  borderWidth: 1,
  data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
}]
// getUserProfile(): Promise<any> {
//   return new Promise<void>((resolve, reject) => {
//     this.http.get<any>(this.url, { headers: this.headers }).subscribe(
//       (data: any) => {
//         this.userProfile = data;
//         this.userDataUrl = `https://nucleus.actofit.com:3000/smartscale/v1/actofit/get_user_data/${this.userProfile.data._id}`;
//         this.dataExists = true;
//         this.http.get<any>(this.userDataUrl, { headers: this.headers }).subscribe(
//           (data2: any) => {
//             data2.data.sort((a:any,b:any)=> a.timestamp - b.timestamp).reverse()
//             this.userData = data2.data[0];
//             this.fulluserdata = data2.data
//             this.lendata = data2.data.length
//             resolve(this.userData);
//           },
//           error => {
//             reject(error)
//           }
//         );

//       },
//       error => {
//         reject(error);
//       }
//     );
    
//   });
// }

getAGPData(): Promise<any>{
  return new Promise<void>((resolve, reject) => {
    this.http.get<any>(this.url, { headers: this.headers }).subscribe(
      (data: any) => {
        this.userProfile = data;
        // console.log(this.userProfile.data._id)
        this.userDataUrl = `https://nucleus.actofit.com:3000/smartscale/v1/cgm/agp-data?date=1675621890000&user_id=${this.userProfile.data._id}`;
        // console.log(this.userDataUrl)
        this.http.get<any>(this.userDataUrl, { headers: this.headers }).subscribe(
          (data2: any) => {
            // data2.data.sort((a:any,b:any)=> a.timestamp - b.timestamp).reverse()
            this.agpPlotData = data2.message.data.agpGraph
            // console.log(this.agpPlotData)
            resolve(this.agpPlotData);
          },
          error => {
            reject(error)
          }
        )
      },
      error => {
        reject(error);
      })
  });

}

getGlucoseData(): Promise<any>{
  return new Promise<void>((resolve, reject) => {
    this.url2 = `https://nucleus.actofit.com:3000/smartscale/v1/cgm/data_details?date=1675621890000&user_id=${this.userProfile.data._id}`
    this.http.get<any>(this.url2, { headers: this.headers }).subscribe(
      (data: any) => {
        // data2.data.sort((a:any,b:any)=> a.timestamp - b.timestamp).reverse()
        this.glucoseData = data.message.data
        resolve(this.glucoseData)
      },
      error => {
        reject(error);
      }
  )
  });

}


  constructor(private http: HttpClient, private par: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
   await this.par.queryParams.subscribe(async params => {
      this.email = params['email']
      // console.log(this.email);
       this.url = `https://nucleus.actofit.com:3000/smartscale/v1/actofit/get_profile?email=${this.email}`;
      //  this.getAGPData()
      //  this.agpPlotData = this.agpPlotData
      });
      
    await this.getAGPData()
    // this.url2 = `https://nucleus.actofit.com:3000/smartscale/v1/cgm/data_details?date=1675621890000&user_id=${this.userProfile.data._id}`
    // this.http.get<any>(this.url2, { headers: this.headers }).subscribe(
    //   (data: any) => {
    //     // data2.data.sort((a:any,b:any)=> a.timestamp - b.timestamp).reverse()
    //     this.glucoseData = data.message.data
    //   })
    this.getGlucoseData()
    console.log("yay", this.glucoseData)

    // const valuesArray = Object.keys(this.glucoseData.graph).map(key => this.glucoseData.graph[key]);
    // console.log(valuesArray)
    // console.log(this.userProfile)
    // console.log("Yay", this.agpPlotData)
    let median = this.agpPlotData.reduce((acc,cur)=>{
      return acc.concat(cur.median)
    },[])
    let tenPer = this.agpPlotData.reduce((acc,cur)=>{
      return acc.concat(cur.tenPer)
    },[])
    let twentyFivePer = this.agpPlotData.reduce((acc,cur)=>{
      return acc.concat(cur.twentyFivePer)
    },[])
    let seventyFivePer = this.agpPlotData.reduce((acc,cur)=>{
      return acc.concat(cur.seventyFivePer)
    },[])
    let nintyFivePer = this.agpPlotData.reduce((acc,cur)=>{
      return acc.concat(cur.nintyFivePer)
    },[])
    this.chartColor = "#FFFFFF";

      this.canvas = document.getElementById("chartHours");
      this.ctx = this.canvas.getContext("2d");
      const yTicks = [0, 70, 180, 250, 350];
      // const customLegend = {
        
      // }
      this.chartHours = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"],
          datasets: [
            {
              borderColor: "#6bd098",
              backgroundColor: "#ffffff",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: median,
              label: "50%"
            },
            {
              borderColor: "#6bd098",
              backgroundColor: "#ffffff",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1,
              data: tenPer,
              label: "10%"
            },
            {
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1,
              data: twentyFivePer,
              label: "25%"
            },
            {
              borderColor: "#6bd098",
              backgroundColor: "#ffffff",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1,
              data: seventyFivePer,
              label: "75%"
            },
            {
              borderColor: "#6bd098",
              backgroundColor: "#ffffff",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1,
              data: nintyFivePer,
              label: "95%"
            }
          ]
        },
        plugins: [{
          afterLayout: chart => {
            let ctx = chart.chart.ctx;
            ctx.save();
            let yAxis = chart.scales["y-axis-0"];
            let yThreshold = yAxis.getPixelForValue(70);
            let yThreshold2 = yAxis.getPixelForValue(180);
            let yThreshold3 = yAxis.getPixelForValue(250)                    
            let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);   
            gradient.addColorStop(0, '#e77b2b'); 
            let offset = 1 / yAxis.bottom * yThreshold3; 
            gradient.addColorStop(offset, '#e77b2b'); 
            gradient.addColorStop(offset, '#efa92c');
            let offset2 = 1 / yAxis.bottom * yThreshold2; 
            gradient.addColorStop(offset2, '#efa92c'); 
            gradient.addColorStop(offset2, '#00a256'); 
            let offset3 = 1 / yAxis.bottom * yThreshold; 
            gradient.addColorStop(offset3, '#00a256'); 
            gradient.addColorStop(offset3, '#d9232a'); 
            gradient.addColorStop(1, '#d9232a');  
            chart.data.datasets[0].borderColor = gradient;
            
            let gradient2 = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);   
            gradient2.addColorStop(0, '#f4b882'); 
            let offset21 = 1 / yAxis.bottom * yThreshold3; 
            gradient2.addColorStop(offset21, '#f4b882'); 
            gradient2.addColorStop(offset21, '#f8c878');
            let offset22 = 1 / yAxis.bottom * yThreshold2; 
            gradient2.addColorStop(offset22, '#f8c878'); 
            gradient2.addColorStop(offset22, '#85c493'); 
            let offset23 = 1 / yAxis.bottom * yThreshold; 
            gradient2.addColorStop(offset23, '#85c493'); 
            gradient2.addColorStop(offset23, '#d9232a'); 
            gradient2.addColorStop(1, '#d9232a'); 
            chart.data.datasets[1].borderColor = gradient2;
            chart.data.datasets[4].borderColor = gradient2;

            let gradient3 = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);   
            gradient3.addColorStop(0, '#f9d8b7'); 
            let offset31 = 1 / yAxis.bottom * yThreshold3; 
            gradient3.addColorStop(offset31, '#f9d8b7'); 
            gradient3.addColorStop(offset31, '#fce1b3');
            let offset32 = 1 / yAxis.bottom * yThreshold2; 
            gradient3.addColorStop(offset32, '#fce1b3'); 
            gradient3.addColorStop(offset32, '#beddbd'); 
            let offset33 = 1 / yAxis.bottom * yThreshold; 
            gradient3.addColorStop(offset33, '#beddbd'); 
            gradient3.addColorStop(offset33, '#93212b'); 
            gradient3.addColorStop(1, '#93212b'); 
            chart.data.datasets[2].borderColor = gradient3;
            chart.data.datasets[3].borderColor = gradient3;

            //gridlines
            // chart.options.scales.yAxes[0].gridLines.color = '#888';

            ctx.restore();
          }
        },
        {
            id: 'customLegend',
            afterDraw: (chart, args, pluginOptions) => {
              const {ctx, data, chartArea: {left, right, top, bottom, width, height}, scales: {x,y}} = chart
              ctx.save();
              data.datasets.forEach((dataset, index) => {
                ctx.textAlign = 'left'
                ctx.fillStyle = "#000"
                ctx.fillText(dataset.label, right, chart.getDatasetMeta(index).data[0]._view.y)
              })
              // console.log(chart.getDatasetMeta(0).data)
              // ctx.fillText('Yay', left, chart.getDatasetMeta(0).data[0]._view.y)
              ctx.restore()
            }
      }
      ],
        options: {
          legend: {
            display: false
          },
           
          tooltips: {
            enabled: false
          },
          layout :{
            padding:{
              right: 40
            }
          },
          scales: {
            indexAxis: 'y',
            yAxes: [{
              ticks: {
                fontColor: "#9f9f9f",
                beginAtZero: true,
                max: 350,
                stepSize: 10,
                padding: 10,
                callback: function(value, index, values){
                  // console.log(values)
                  if(index === 0 || index === 10 || index === 17 || index === 28 || index === 35){
                    this.options.scaleLineColor = '#e77b2b'
                    return value
                  }
                }
                // callback: function(value, index, values) {
                //   if (yTicks.includes(value)) {
                //     return value;
                //   }
                //   return '';
                // }
                // maxTicksLimit: 5,
                //padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#ccc",
                z: 50,
                lineWidth: 2,
                // color: function(context){
                //   if(context.tick.value === 70 || context.tick.value === 180){
                //     return 'green'
                //   }
                //   console.log(context)
                // }
                // color: function(value, index, values){
                //   console.log("yaya", values)
                //   if(index === 0 || index === 10 || index === 17 || index === 28 || index === 35){
                //     return '#000'
                //   }
                // }
              }

            }],
            y2:[{
              labels:['Target Range']
            }],
            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent",
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: "#9f9f9f"
              }
            }]
          },
        }
      });

      const annotation2 = { 
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xScaleID: "x-axis-0",
          yScaleID: "y-axis-0",
          borderWidth: 0,
          yMin: 320,
          yMax: 340,
          backgroundColor: "#d1d1d1",
          borderColor: "transparent"
      };
      

      this.canvas = document.getElementById("wedChart");
      this.ctx = this.canvas.getContext("2d");
      this.threshold = 320
      this.threshold2 = 340   
      this.wedChart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
          datasets:this.chartdata
        },
        plugins: [{
          afterLayout: chart => {
            let ctx = chart.chart.ctx;
            ctx.save();
            let yAxis = chart.scales["y-axis-0"];
            let yThreshold = yAxis.getPixelForValue(this.threshold);
            let yThreshold2 = yAxis.getPixelForValue(this.threshold2);                    
            let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);   
            gradient.addColorStop(0, '#f0ae3a'); 
            let offset = 1 / yAxis.bottom * yThreshold2; 
            gradient.addColorStop(offset, '#f0ae3a'); 
            gradient.addColorStop(offset, 'green');
            // console.log(yAxis.bottom, offset, yThreshold2)
            let offset2 = 1 / yAxis.bottom * yThreshold; 
            gradient.addColorStop(offset2, 'green'); 
            gradient.addColorStop(offset2, 'red'); 
            gradient.addColorStop(1, 'red');           
            chart.data.datasets[0].borderColor = gradient;
            ctx.restore();
          }
        },
      ],
        options: {
          annotation:{
            annotations:[annotation2]
        },
          legend: {
            display: false
          },
          
          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                fontColor: "#9f9f9f",
                beginAtZero: true,
                // maxTicksLimit: 5,
                max: 350,
                stepSize: 10,
                display: false,
                // callback: function(value, index, values){
                //   console.log(index, value)
                //   if(index === 28 || index === 17){
                //     return value
                //   }
                // }
                //padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#ccc",
                color: 'rgba(255,255,255,0.05)'
              }
              

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent",
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: "#9f9f9f",
                display: false
              }
            }]
          },
        }
      });

      this.canvas = document.getElementById("thurChart");
      this.ctx = this.canvas.getContext("2d");
      this.threshold = 320
      this.threshold2 = 340
      this.thurChart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
          datasets:this.chartdata
        },
        plugins: [{
          afterLayout: chart => {
            let ctx = chart.chart.ctx;
            ctx.save();
            let yAxis = chart.scales["y-axis-0"];
            let yThreshold = yAxis.getPixelForValue(this.threshold);
            let yThreshold2 = yAxis.getPixelForValue(this.threshold2);                    
            let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);   
            gradient.addColorStop(0, '#f0ae3a'); 
            let offset = 1 / yAxis.bottom * yThreshold2; 
            gradient.addColorStop(offset, '#f0ae3a'); 
            gradient.addColorStop(offset, 'green');
            let offset2 = 1 / yAxis.bottom * yThreshold; 
            gradient.addColorStop(offset2, 'green'); 
            gradient.addColorStop(offset2, 'red'); 
            gradient.addColorStop(1, 'red');           
            chart.data.datasets[0].borderColor = gradient;
            ctx.restore();
          }
        }],
        options: {
          legend: {
            display: false
          },
          
          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                fontColor: "#9f9f9f",
                beginAtZero: false,
                maxTicksLimit: 5,
                display: false
                //padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#ccc",
                color: 'rgba(255,255,255,0.05)'
              }
              

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent",
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: "#9f9f9f",
                display: false
              }
            }]
          },
        }
      });
      // this.setLineColorBasedOnThreshold()
  }
  setLineColorBasedOnThreshold() {
    this.chartdata.forEach(dataset => {
      dataset.data.forEach((value, index) => {
        if (value > this.threshold) {
          dataset.borderColor = 'blue';
          // dataset.backgroundColor = 'rgba(0, 255, 0, 0.2)';
          
        } else if (value < this.threshold) {
          dataset.borderColor = 'red';
          // dataset.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        }
      });
    });
  }
}
