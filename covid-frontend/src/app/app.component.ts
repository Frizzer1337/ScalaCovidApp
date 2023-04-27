import {Component, OnInit} from '@angular/core';
import {AppService} from "./service/app.service";
import {CountryData} from "./entity/countryData";
import {Country} from "./entity/country";
import {Chart} from 'chart.js/auto'
import {FormControl, FormGroup} from "@angular/forms";


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

  selectCountry(event: Event) {
    this.selectedCountry = (event.target as HTMLButtonElement).id + "";
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

}
