import {Component, OnDestroy} from '@angular/core';
import {Categorie, Category, Difficulty, FormQuizMaker, MacroCategorie, Question, SottoCategorie} from '../data.models';
import {Observable,  Subject, takeUntil} from 'rxjs';
import {QuizService} from '../quiz.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.scss']
})
export class QuizMakerComponent implements OnDestroy {

  private onDestroy$ = new Subject();
  nascondiPulsanti = false;

  /** template driven form */
  formQuiz: FormQuizMaker = {
    category: '',
    subCategory: '',
    difficulty: ''
  }

  categories$: Observable<Category[]>;

  /** lista di tutte le macrocategorie e sottocategorie ricavate dall'Observable categories$ */
  macro_categorie!: MacroCategorie[];
  sotto_categorie!: SottoCategorie[];

  /** lista delle sottocategorie filtrate per macrocategoria da visualizzare nella combo */
  sotto_categorie_view!: SottoCategorie[];


  /** campi popolati al click sul Create */
  idCategoriaSelezionata: number | undefined;
  idSottoCategoriaSelezionata: number | undefined;
  idForQuestion: number | undefined;


  /** lista question da passare al componente */
  questions!: Question[];
  /** nuova question da sostituire nell'array se ho cliccato su cambia domanda */
  questionsToChange!: Question;



  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories();

    /**  valorizzomacro_categorie e sotto_categorie*/
    this.categories$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((res: Category[]) => {
      let alberoCategorie = this.getMacroCategoryAndSubCategory(res);
      this.macro_categorie = alberoCategorie.listaMacroCategorie;
      this.sotto_categorie = alberoCategorie.listaSottocategorie;
      /** inizialmente non ho filtrato la categoria le faccio vedere tutte */
      console.log(this.macro_categorie);
      console.log(this.sotto_categorie);
    });

  }


  /** unsubscribe */
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }


/** 
* @summary Restituisce la lista delle cateorie divise in macrocategorie e sottocategorie
* @param {Category[]} categorie - array delle categorie api_category.php
* @return {Categorie} oggetto Categorie contenente listaMacroCategorie: MacroCategorie[] + listaSottocategorie: SottoCategorie[];
*/
getMacroCategoryAndSubCategory(categorie: Category[]): Categorie {
  let datoDiRitorno: Categorie = {
    listaMacroCategorie: [],
    listaSottocategorie: []
  };
    let idCategoriaFittizio = 0;
   
    categorie.forEach( element => {
      let listaId: number[] = [];
      idCategoriaFittizio++;

      //se ho sottocategorie devo popolare entrambe le liste listaMacroCategorie e listaSottocategorie
      if (element.name.indexOf(':') !== -1) {
        let nomeMacrocategoria = element.name.split(":")[0].trim(); //nome macro categoria
        let nomeSottocategoria = element.name.split(":")[1].trim(); //nome sotto categoria

 
        let isPresenteMacro = datoDiRitorno.listaMacroCategorie.filter((item) => item.nome === nomeMacrocategoria);
        //se ho già la macrocategoria aggiorno solo listaIdSottocategorie in listaMacroCategorie e aggiungo
        // la sottocategoria in listaSottocategorie
        if (isPresenteMacro && isPresenteMacro.length > 0) {
        datoDiRitorno.listaMacroCategorie.find((item) => item.nome === nomeMacrocategoria)?.listaIdSottocategorie.push(element.id);
        let sottocategoria: SottoCategorie = {
          id: element.id,
          nome: nomeSottocategoria
        };
        datoDiRitorno.listaSottocategorie.push(sottocategoria);
        } 
          //se non ho ancora la macrocategoria  creo sia macrocategoria che sotto categoria
        else {
     
          listaId.push(element.id);
          let macrocategoria: MacroCategorie = {
            listaIdSottocategorie: listaId,
            nome: nomeMacrocategoria,
            id: idCategoriaFittizio
          };

          let sottocategoria: SottoCategorie = {
            id: element.id,
            nome: nomeSottocategoria
          };
          datoDiRitorno.listaMacroCategorie.push(macrocategoria);
          datoDiRitorno.listaSottocategorie.push(sottocategoria);
        }
       
      }
      //se non ho sottocategorie aggingo solo la macrocategoria in listaMacroCategorie
      // che avrà la lista id con un solo elemento
      else {
        listaId.push(element.id);
        let macrocategoria: MacroCategorie = {
          listaIdSottocategorie: listaId,
          nome: element.name,
          id: idCategoriaFittizio
        };
        datoDiRitorno.listaMacroCategorie.push(macrocategoria);
     
      }
    });
  
    return datoDiRitorno;
  }


/** 
* scatta al click sulla categoria da parte del componente condiviso. 
* controllo se ci sono eventuali sottocategorie da visualizzare
* e sbianco eventuali sottocategorie selezionate
*/
  caricaSottoCategorie(idMacroCategoria: number) {
    this.formQuiz.subCategory = '';
    let macrocategoria = this.macro_categorie.find(x => x.id === idMacroCategoria);
    this.idCategoriaSelezionata = macrocategoria?.id;
    this.idSottoCategoriaSelezionata = undefined;
    if (macrocategoria) {
      this.formQuiz.category = macrocategoria?.nome;
      if (macrocategoria.listaIdSottocategorie && macrocategoria.listaIdSottocategorie.length > 1) {
        this.sotto_categorie_view = this.sotto_categorie.filter((item) => macrocategoria?.listaIdSottocategorie.includes(item.id));
      }
      else {
        this.sotto_categorie_view = [];
      }
    }
  }


/** 
* scatta al click sulla sulla sottocategoria da parte del componente condiviso.
*/
  settaValoreSottocategoria(idSottoCateoriaSelezionata: number) {
    let sottocategoria = this.sotto_categorie_view.find(x => x.id === idSottoCateoriaSelezionata);
    if (sottocategoria) {
      this.formQuiz.subCategory = sottocategoria.nome;
      this.idSottoCategoriaSelezionata = sottocategoria.id;
    }
   
  }

  
/** 
* chiamo il servizio createQuiz specificando il numero di quiz da restituire
*/
  createQuiz(quizForm: NgForm, numeroDomande: number): void {
    console.log(quizForm);
    this.nascondiPulsanti = false;
   let categoriaSelezionata = this.macro_categorie.find(x => x.id === this.idCategoriaSelezionata);
   if (categoriaSelezionata){
    this.idForQuestion = categoriaSelezionata?.listaIdSottocategorie[0];
   }

   if (this.idSottoCategoriaSelezionata) {
    let sottocategoriaSelezionata = this.sotto_categorie.find(x => x.id === this.idSottoCategoriaSelezionata);
    this.idForQuestion = sottocategoriaSelezionata?.id;
   }


   let difficulty = quizForm.form.get('difficulty')?.value;

   if (this.idForQuestion)
      this.quizService.createQuiz(this.idForQuestion?.toString(), difficulty as Difficulty, numeroDomande)
      .pipe(takeUntil(this.onDestroy$)).subscribe( res => {
      this.questions = res;
   });
  }


/** 
* metodo che scatta quando viene emesso il changeQuestion dal figlio
*/
  cambiaDomanda(indice: number) {
    let difficulty = this.formQuiz.difficulty;
    if (this.idForQuestion)
    this.quizService.createQuiz(this.idForQuestion?.toString(), difficulty as Difficulty, 1).
    pipe(takeUntil(this.onDestroy$)).subscribe((res: Question[]) => {
        this.questionsToChange = res[0];
        this.questions[indice] = this.questionsToChange;
        this.nascondiPulsanti = true;
    })
  }
}
