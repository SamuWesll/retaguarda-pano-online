import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})

export class ProdutosService {

  constructor(private http: HttpClient) { }

  getLista() {
    let url: string = "http://localhost:8080/meupanoonline/produto/lista";
    let buscarProdudos = this.http.get(url);
    return buscarProdudos
  }

}
