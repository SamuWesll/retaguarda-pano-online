import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  faCalendar = faCalendar;

  pedidos: any = [];
  
  venda: number = 0;
  qtdProdutos: number = 0;
  qtdCliente: any;

  // status
  status = [
    {
      ds_status: "Aguardando confirmação de pagamento",
      quantidade: 0,
    },
    {
      ds_status: "Pagamento confirmado",
      quantidade: 0,
    },
    {
      ds_status: "Produto em separação",
      quantidade: 0,
    },
    {
      ds_status: "Produto enviado",
      quantidade: 0,
    },
    {
      ds_status: "Produto entregue",
      quantidade: 0,
    },
];

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private pedidoService: PedidosService) {
    this.fromDate = calendar.getNext(calendar.getToday(), 'd', -5);
    this.toDate = calendar.getToday();
  }

  // Inicio dos metodos do calendario
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.getPedidoPeriodo(this.dataString(this.fromDate), this.dataString(this.toDate))
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.getPedidoPeriodo(this.dataString(this.fromDate), this.dataString(this.toDate))
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  // Fim dos metodos do calendario

  contadorStatus(ped) {
      for(let i = 0; i < this.status.length; i++) {
        if(ped.status == this.status[i].ds_status) {
          return this.status[i].quantidade += 1;
        }
      }
  }

  getPedidoPeriodo(inicio: string, fim: string) {

    this.pedidoService.getPedidosPeriodo(inicio, fim).subscribe(
      data => {
        if(data[0].idPedido) {
          this.pedidos = data;
          this.venda = 0;
          this.qtdProdutos = 0;
          this.status[0].quantidade = 0;
          this.status[1].quantidade = 0;
          this.status[2].quantidade = 0;
          this.status[3].quantidade = 0;
          this.status[4].quantidade = 0;
          this.pedidos.forEach(pedido => {
             this.venda += pedido.totalCompra + pedido.valorFrete
             pedido['itensPedido'].forEach(itensProd => {
                this.qtdProdutos += itensProd.qtdProduto;
             })
             this.contadorStatus(pedido);
          });
          this.qtdCliente = 0;
          let contadorCliente = this.pedidos.reduce((acc, current) => {
            const x = acc.find(item => item.tbClienteIdCliente === current.tbClienteIdCliente);
            if(!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          this.qtdCliente = contadorCliente.length;
          console.log(this.pedidos);
          console.log(this.status)
        }
      },
      ERROR => {
        if(ERROR['error'] == "Não existem pedidos cadastrados nesse período") {
          this.pedidos = [];
          this.venda = 0;
          return alert(ERROR['error'])
        }
      }
    )
  };

  mascaraValor(valor: number) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  };

  menorDez(n: number) {
    if(n < 10) {
      return "0" + n;
    }
    return n + "";
  }

  dataString(date: NgbDate): string {

    function menorZero(n) {
      if(n < 10) {
        return "0" + n;
      }
      return n + "";
    };

    let ano = date.year + "";
    let mes = menorZero(date.month);
    let dia = menorZero(date.day);
    
    return ano + "-" + mes + "-" + dia;
  }

  retorno() {
    console.log("funcionou")
  }

  ngOnInit(): void {
    this.getPedidoPeriodo(this.dataString(this.fromDate), this.dataString(this.toDate));
  }

}
