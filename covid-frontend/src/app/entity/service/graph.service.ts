import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CountryData} from "../countryData";
import {environment} from "../../enviroment/environment";

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private client: HttpClient) {
  }

  getCountry(startDate: string, endDate: string, countryName: string) {
    return this.client.get<CountryData[]>(`${environment.apiUrl}/countries/${countryName}?from=${startDate}&to=${endDate}`)
  }
}
