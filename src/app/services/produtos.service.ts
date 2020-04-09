import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators'
import { Produtos } from '../models/Produtos';
import { Observable, throwError } from 'rxjs';

const URLPRODUTO = "http://localhost:8080/meupanoonline/produto"

@Injectable({
  providedIn: 'root'
})

export class ProdutosService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getLista() {
    let url: string = "http://localhost:8080/meupanoonline/produto/lista";
    let buscarProdudos = this.http.get(url);
    return buscarProdudos
  };

  putProduto(produto: Produtos) {
    let id = produto['idProduto'] * 1;
    const URL = "http://localhost:8080/meupanoonline/produto?idProduto="+ id;
    let body = {
      tituloProduto: produto['tituloProduto'],
      descricao: produto['descricao'],
      imagem: produto['imagem'],
      valor: (produto['valor'] * 1),
      valorDesconto: produto['valorDesconto'],
      categoria: produto['categoria'],
      qtdProduto: produto['qtdProduto'],
    };
    // let atualizandoProd = this.http.put(URLPRODUTO+"/produto?idProduto="+id, JSON.stringify(body))
    let atualizandoProd = this.http.put(URL, body, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)  
    )
    return atualizandoProd;
  };

  createProduto(produto) {
    let create = this.http.post(URLPRODUTO, produto, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
    return create;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}
