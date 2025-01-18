import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product, ProductsService } from "../../services/products.service";
import { BehaviorSubject, Observable, filter, map, switchMap, tap } from "rxjs";
import {
  AsyncPipe,
  DatePipe,
  KeyValuePipe,
  NgFor,
  NgIf,
} from "@angular/common";
import { TaskTableComponent } from "./components/task-table/task-table.component";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, KeyValuePipe, TaskTableComponent],
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent implements OnInit {
  private _refresh$ = new BehaviorSubject<void>(undefined);
  product$!: Observable<Product>;

  constructor(
    private _route: ActivatedRoute,
    private _service: ProductsService,
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    this.product$ = this._refresh$.pipe(
      filter((_) => !!id),
      switchMap(() => this._service.findOne(id!)),
    );
  }

  refreshProduct() {
    this._refresh$.next();
  }
}
