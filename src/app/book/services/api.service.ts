import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postItem(data: any) {
    return this.http.post<any>(`${environment.url}/books`, data);
  }

  getItem() {
    return this.http.get<any>(`${environment.url}/books`);
  }

  putItem(data: any, id: number) {
    return this.http.put<any>(`${environment.url}/books/`+id, data)
  }

  deleteItem(id: number){
    return this.http.delete<any>(`${environment.url}/books/`+id);
  }

  deleteAll() {
    return this.http.delete<any>(`${environment.url}/books/`).pipe(
      map((x:any) =>{
        for(let data of x.id){
          this.deleteItem(data);
        }
      })
    )
  }
}
