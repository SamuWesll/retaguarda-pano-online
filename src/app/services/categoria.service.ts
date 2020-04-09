import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  getLista() {
    const URL: string = "http://localhost:8080/meupanoonline/categoria/lista";
    let buscarCategoria = this.http.get(URL);
    return buscarCategoria;
  }

}
