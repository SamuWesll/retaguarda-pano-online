import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageAdminComponent } from './components/page-admin/page-admin.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full"
  },
  {
    path: "page",
    component: PageAdminComponent,
  },
  {
    path: "produtos",
    component: ProdutosComponent
  },
  {
    path: "clientes",
    component: ClientesComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "pedidos",
    component: PedidosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
