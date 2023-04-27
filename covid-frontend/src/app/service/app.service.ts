import {Injectable} from "@angular/core";
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

}
