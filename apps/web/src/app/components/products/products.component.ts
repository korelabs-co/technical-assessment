import { Component, OnInit } from "@angular/core";
import { Product, ProductsService } from "../../services/products.service";
import { Observable } from "rxjs";
import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe, ConfirmationDialogComponent],
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.scss",
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Product[]>;
  showDeleteDialog = false;
  productToDelete: string | null = null;

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
    this._router.navigate(["products", id]);
  }

  openDeleteDialog(id: string, event: Event) {
    event.stopPropagation();
    this.productToDelete = id;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this._service.delete(this.productToDelete).subscribe(() => {
        this.loadProducts();
        this.closeDeleteDialog();
      });
    }
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.productToDelete = null;
  }
}
