import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductComponent },
    ],
  },
];
