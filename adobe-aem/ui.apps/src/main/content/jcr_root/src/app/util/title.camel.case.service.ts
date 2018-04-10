import { Injectable } from '@angular/core';

@Injectable()

export class CamelCaseConvert {
    titleCase(str): any {
        let inputStr = str.split('-');
        let outputStr = "";
        for (let i = 0; i < inputStr.length; i++) {
            let titleWord = this.wordToTitleCase(inputStr[i]);
            if (i > 0) {
                titleWord = "-" + titleWord ;
            }
            outputStr = outputStr + titleWord;
        }
        return outputStr;
    }

    private wordToTitleCase(word){        
        let str1 = "";
        return str1 = word.toLowerCase().replace(/(?:(^.)|(\s+.))/g, function (match) {           
            return match.charAt(match.length - 1).toUpperCase();
        });
    }
}
