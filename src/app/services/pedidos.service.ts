import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

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

  getPedidosPeriodo(inicio: string, fim: string) {
    const URL: string = `http://localhost:8080/meupanoonline/pedido/vendas-periodo?inicio=${inicio}&fim=${fim}`
    return this.http.get(URL, this.httpOptions)
    // return this.http.get(URL, this.httpOptions).pipe(
    //   retry(0),
    //   catchError(this.handleError)
    // )
  }

  putPedidoStatus(pedido) {
    let pedidoAlterado;
    const URL = `http://localhost:8080/meupanoonline/pedido?idPedido=${pedido.idPedido}`
    let bodyPedido = {
      valorFrete: pedido.valorFrete,
      totalCompra: pedido.totalCompra,
      formaPgto: pedido.formaPgto,
      status: pedido.status,
      dataPedido: pedido.dataPedido,
      tbClienteIdCliente: pedido.tbClienteIdCliente,
      tbEnderecoIdEndereco: pedido.tbEnderecoIdEndereco,
      itensPedido: pedido.itensPedido
    }
    pedidoAlterado = this.http.put(URL, bodyPedido, this.httpOptions);
    return pedidoAlterado;
  }

}
