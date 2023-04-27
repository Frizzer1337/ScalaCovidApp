import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CountryData} from "../entity/countryData";
import {Chart} from "chart.js/auto";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {GraphService} from "../entity/service/graph.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges, OnInit {

  @Input() countryName: string = ""
  data: CountryData[] = []
  chartData: number[] = []
  chart: Chart | undefined;
  range = new FormGroup({
    start: new FormControl<Date | null>(new Date('2020-04-01')),
    end: new FormControl<Date | null>(new Date('2020-05-01')),
  });

  constructor(private service: GraphService) {
  }

  ngOnInit() {
    this.createChart()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes")

    const startDate = this.range.controls.start.value?.toISOString();
    const endDate = this.range.controls.end.value?.toISOString();
    console.log(this.countryName)
    console.log(startDate + " and " + endDate)
    if (startDate != undefined && endDate != undefined) {
      this.service.getCountry(startDate, endDate, this.countryName).subscribe(
        countryData => {
          this.data = countryData
          this.chartData = this.data.map(it => it.confirmedToday)
          console.log(this.chartData)
          this.chart?.destroy()
          this.createChart()
        })
    }
  }


  createChart() {
    const canvas = document.getElementById('dataChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.chartData = this.data.map(result => result.confirmedToday)

    if (ctx != undefined && this.range.controls.start.value != undefined && this.range.controls.end.value != undefined) {
      const dateArray = this.getDateArray(this.range.controls.start.value, this.range.controls.end.value)
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dateArray.map(date => date.toLocaleDateString()),
          datasets: [{
            label: 'Confirmed by day',
            data: this.chartData,
            borderColor: 'rgb(62,141,255)',
            borderWidth: 2,
            fill: true
          }]
        },
        options: {}
      });
    }
  }

  getDateArray(startDate: Date, endDate: Date): Date[] {
    const dateArray = [];

    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1)


    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  startDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value?.getFullYear() != undefined) {
      this.range.controls.start.value?.setFullYear(event.value?.getFullYear())
    }
  }

  endDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value?.getFullYear() != undefined) {
      this.range.controls.end.value?.setFullYear(event.value?.getFullYear())
    }
  }

}
