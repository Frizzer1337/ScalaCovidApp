import {Component, OnInit} from '@angular/core';
import {AppService} from "./service/app.service";
import {CountryData} from "./entity/countryData";
import {Country} from "./entity/country";
import {Chart} from 'chart.js/auto'
import {FormControl, FormGroup} from "@angular/forms";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  countries: Country[] = []
  displayedCountries: Country[] = []
  country: CountryData[] = []
  data: Map<String, CountryData[]> = new Map<String, CountryData[]>()
  chart: Chart | undefined;
  selectedCountry: string = ""
  range = new FormGroup({
    start: new FormControl<Date | null>(new Date('2020-04-01')),
    end: new FormControl<Date | null>(new Date('2020-05-01')),
  });

  constructor(private service: AppService) {
  }

  ngOnInit() {

    this.service.getAllCountries().subscribe(
      data => {
        this.countries = data.sort(
          (a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0))
        this.displayedCountries = this.countries
      })
  }

  filterCountries(event: KeyboardEvent) {
    const filterText = (event.target as HTMLInputElement).value
    if (filterText == "") {
      this.displayedCountries = this.countries
    } else {
      this.displayedCountries = this.countries.filter(country =>
        country.country.toLowerCase().includes(filterText.toLowerCase()))
    }
  }

  showChart(event: MouseEvent) {
    const countryName: string = (event.target as HTMLButtonElement).id + "";
    const startDate = this.range.controls.start.value?.toISOString();
    const endDate = this.range.controls.end.value?.toISOString();
    // @ts-ignore
    this.service.getCountry(startDate, endDate, countryName).subscribe(
      countryData => {
        this.data.set(countryName, countryData)
        this.selectedCountry = countryName
        this.destroyChart()
        this.createChart(countryName)
      })
  }

  startDateChange(event: MatDatepickerInputEvent<Date>) {
    // @ts-ignore
    this.range.controls.start.value?.setFullYear(event.value?.getFullYear())
  }

  endDateChange(event: MatDatepickerInputEvent<Date>){
    // @ts-ignore
    this.range.controls.end.value?.setFullYear(event.value?.getFullYear())
  }

  destroyChart() {
    this.chart?.destroy()
  }

  createChart(country: String) {
    const canvas = document.getElementById('dataChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // @ts-ignore
    let data: number[] = this.data.get(country).map(result => result.confirmedToday)

    const dateArray = this.getDateArray(this.range.controls.start.value, this.range.controls.end.value)

    // @ts-ignore
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateArray.map(date => date.toLocaleDateString()),
        datasets: [{
          label: 'Confirmed by day',
          data: data,
          borderColor: 'rgb(62,141,255)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {}
    });
  }

  getDateArray(startDate: Date | null, endDate: Date | null): Date[] {
    const dateArray = [];
    console.log(startDate)
    console.log(endDate)
    // @ts-ignore
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1)

    // @ts-ignore
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

}
