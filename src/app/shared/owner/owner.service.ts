import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  public API = '//thawing-chamber-47973.herokuapp.com';
  public OWNER_API = this.API + '/owners';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.OWNER_API);
  }

  get(dni: string) {
    return this.http.get(this.OWNER_API + '/' + dni);

  }
}
