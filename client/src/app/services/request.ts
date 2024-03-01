import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
})
export class Request {
    constructor(
        private http: HttpClient
    ) {}

    public post(url: string, params: any): Observable<any> {
        return this.http.post(url, params, {});
    }

    public get(url: string, params: any): Observable<any> {
        return this.http.get(url, {params: params});
    }
}