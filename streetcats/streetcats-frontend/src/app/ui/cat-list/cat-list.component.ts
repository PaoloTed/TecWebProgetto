import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { MapComponent } from '../map/map.component';
import { Cat } from '../../type/cat.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cat-list',
  imports: [MapComponent],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.scss'
})
export class CatList implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  cats: Cat[] = [];

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.apiService.getCats().subscribe({
      next: (catsRecived) => {
        this.cats = catsRecived;
      },
      error: () => {
        this.toastr.error('Errore nel caricamento dei gatti.', 'Errore');
      }
    });
  }

  // Naviga alla pagina del gatto quando viene cliccato il marker sulla mappa
  onCatClicked(id: number) {
    this.router.navigate(['/cats', id]);
  }
}
