import {AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Question} from '../data.models';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements AfterContentInit {

  @Input({required: true})
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;

  //primary = blue
  //tertiary = green

  /** riferimento al contenuto dei bottoni proiettati dal componente QuizComponent*/
  @ContentChild('bottone') bottone!: ElementRef;

  getButtonClass(answer: string): string {
    if (! this.userAnswer) {
        if (this.currentSelection == answer)
          return "tertiary";
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return "tertiary";
      if (answer == this.correctAnswer)
        return "secondary";
    }
    return "primary";
  }

  @Output()
  change = new EventEmitter<string>();

  currentSelection!: string;

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }

  ngAfterContentInit(): void {
    console.log(this.bottone);
  }
}
