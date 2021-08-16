
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class WebService {
  BASE_URL = 'https://usa-api.idomoo.com/api/v2';
  authorization =
    'Basic ' +
    btoa('3550:PiKQ1xfuKC22c1c5c0061af12a240e092d93ec6a47gmckwQGhp6');

  constructor(private http: HttpClient) {}

  postMessage(type, message): Observable<any> {
    return this.http.post(this.BASE_URL + type, message, {
      headers: {
        Authorization: this.authorization,
        Accept: 'application/json'
      }
    });
  }

  getMessage(type): Observable<any> {
    return this.http.get(this.BASE_URL + type, {
      headers: {
        Authorization: this.authorization,
        Accept: 'application/json'
      }
    });
  }

  checkVideo(url): Observable<any> {
    return this.http.get(url, {
      headers: {
        Authorization: this.authorization,
        Accept: 'application/json'
      }
    });
  }
}
