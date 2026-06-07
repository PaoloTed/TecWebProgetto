import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class Footer implements OnInit {
  private http = inject(HttpClient);
  catFact: string = '';

  ngOnInit() {
    this.http.get<any>('https://catfact.ninja/fact').subscribe({
      next: (res) => this.catFact = res.fact,
      error: (err) => console.error('Errore cat fact', err)
    });
  }
}
