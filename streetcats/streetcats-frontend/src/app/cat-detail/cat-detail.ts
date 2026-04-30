import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../_services/api/api.service';

@Component({
  selector: 'app-cat-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './cat-detail.html',
  styleUrl: './cat-detail.scss'
})
export class CatDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  cat: any = null;
  comments: any[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCatDetails(id);
    } else {
      this.error = 'ID Gatto non valido.';
      this.isLoading = false;
    }
  }

  loadCatDetails(id: number) {
    this.apiService.getCatById(id).subscribe({
      next: (data) => {
        this.cat = data;
        // Carica anche i commenti
        this.apiService.getCatComments(id).subscribe({
          next: (comments) => {
            this.comments = comments;
            this.isLoading = false;
          },
          error: () => {
            // Ignora errore sui commenti per non bloccare la pagina
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Impossibile caricare i dettagli del gatto.';
        this.isLoading = false;
      }
    });
  }
}
