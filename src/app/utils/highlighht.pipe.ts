import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'highlight'
  })
  export class HighlightPipe implements PipeTransform {
    transform(text: string, search: string, searchKeyword: string): any {
      if (searchKeyword) {
        let pattern = searchKeyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern.split(' ').filter((t) => {
          return t.length > 0;
        }).join('|');
        const regex = new RegExp(pattern, 'gi');
        return searchKeyword ? text.replace(regex, (match) => `<b>${match}</b>`) : text;
      } else {
        return text;
      }
 
    }
  }