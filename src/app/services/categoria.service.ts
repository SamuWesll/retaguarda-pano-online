import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  getLista() {
    const URL: string = "http://localhost:8080/meupanoonline/categoria/lista";
    let buscarCategoria = this.http.get(URL);
    return buscarCategoria;
  }

  createCategoria(body) {
    const URL: string = "http://localhost:8080/meupanoonline/categoria";
    let criarCategoria = this.http.post(URL, body).pipe(
      retry(1),
      catchError(this.handleError)
    )
    return criarCategoria;
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
