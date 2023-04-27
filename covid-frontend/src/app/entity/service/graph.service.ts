import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CountryData} from "../countryData";

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private client: HttpClient) {
  }

  getCountry(startDate: string, endDate: string, countryName: string) {
    return this.client.get<CountryData[]>(`http://localhost:7000/api/by-country/${countryName}?from=${startDate}&to=${endDate}`)
  }
}
