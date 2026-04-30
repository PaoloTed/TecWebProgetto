import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../_services/api/api.service';

@Component({
  selector: 'app-cat-list',
  imports: [RouterLink],
  templateUrl: './cat-list.html',
  styleUrl: './cat-list.scss'
})
export class CatList implements OnInit {
  private apiService = inject(ApiService);
  
  cats: any[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.apiService.getCats().subscribe({
      next: (data) => {
        this.cats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento dei gatti.';
        this.isLoading = false;
      }
    });
  }
}
