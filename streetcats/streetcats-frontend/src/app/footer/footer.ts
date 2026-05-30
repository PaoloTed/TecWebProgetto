import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
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

  playMeow() {
    const audio = new Audio('https://actions.google.com/sounds/v1/animals/cat_meow.ogg');
    audio.play().catch(e => console.log('Audio non riprodotto:', e));
  }
}
