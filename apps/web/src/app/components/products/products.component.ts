import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(
    private _service: ProductsService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this._service.findAll();
  }

  showProduct(id: string) {
    this._router.navigate(['products', id]);
  }

  async deleteProduct(id: string, event: Event) {
    // @todo add custom confirmation dialog here - following a similar design
    event.stopPropagation();
    this._service.delete(id).subscribe(() => this.loadProducts())
  }
}
