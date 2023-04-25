import {Injectable} from "@angular/core";
import {CountryData} from "../entity/countryData";
import {Country} from "../entity/country";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(private client: HttpClient) {
  }

  getAllCountries() {
    return this.client.get<Country[]>('http://localhost:7000/api/countries')
  }

  getCountry(startDate : string, endDate : string,countryName: string) {
    return this.client.get<CountryData[]>(`http://localhost:7000/api/by-country/${countryName}?from=${startDate}&to=${endDate}`)
  }


}
