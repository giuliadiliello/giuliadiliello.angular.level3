export interface Category {
  id: number;
  name: string;
}

export interface ApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface Results {
  questions: Question[];
  answers: string[];
  score: number;
}


export type Difficulty = "Easy" | "Medium" | "Hard";


/***********************/
export interface FormQuizMaker {
  category: string;
  subCategory: string;
  difficulty: string;
}



export interface Categorie {
  listaMacroCategorie: MacroCategorie[];
  listaSottocategorie: SottoCategorie[];
}
export interface MacroCategorie {
  id: number;
  listaIdSottocategorie: number[]; //lista id, sarà uno solo se non ho sottocategorie altrimenti ho un array di id
  nome: string;
};

export interface SottoCategorie {
  id: number;
  nome: string;
};

