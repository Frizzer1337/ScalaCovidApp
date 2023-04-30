import {Injectable} from "@angular/core";
import {Country} from "../entity/country";
import {HttpClient} from "@angular/common/http";
import {environment} from "../enviroment/environment";

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(private client: HttpClient) {
  }

  getAllCountries() {
    return this.client.get<Country[]>(`${environment.apiUrl}/countries`)
  }

}
