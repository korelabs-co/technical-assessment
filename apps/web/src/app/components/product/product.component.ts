import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '../../services/products.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, KeyValuePipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product$!: Observable<Product>;

  constructor(
    private _route: ActivatedRoute,
    private _service: ProductsService,
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this.product$ = this._service
      .findAll()
      .pipe(
        map(
          (products: Product[]) =>
            products.find((product) => product.id === id)!,
        ),
      );
  }
}
