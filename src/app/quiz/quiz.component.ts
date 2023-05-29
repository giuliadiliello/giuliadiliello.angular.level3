import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  constructor() {}

  @Input()
  questions: Question[] | null = [];

  /** È possibile scambiare solo una domanda per quiz, 
   * il che significa che una volta che l'utente fa clic su uno di questi pulsanti, 
   * rimuovere tutti i pulsanti "cambia domanda". */
  @Input()
  nascondiPulsanti = false;

  /** Informo il componente padre di cambiare la domanda selezionata */
  @Output() changeQuestion = new EventEmitter<number>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);



  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }


/** grazie all'ng-container posso ciclare la lista delle domande e prendere l'index di quello cliccato.
 * Mando date informazione al padre per aggiornare la domanda cliccata
 */
  sonoStatoCliccato(index: number) {
    this.changeQuestion.emit(index);
  }
}
