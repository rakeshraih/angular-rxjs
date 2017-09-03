import { Component , OnInit} from '@angular/core';
import { Http } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  scriptName = '';
  scriptDetail; string;
  scripts;
  scriptsLatest = new Subject<string>();
  resetObser = new Observable;
  inputCount:number = 10;

  constructor(public http: Http) {
    this.scripts = this.scriptsLatest
    .debounceTime(500)
    .distinct()
    .filter(scriptName => !!scriptName)
    .retry(3)
    .switchMap(
      scriptName => this.http.get(`http://www.nasdaq.com/aspx/symbolnamesearch.aspx?q=+${scriptName}`,{})
      .map( res => res.text().split('\n'))
    ).distinctUntilChanged()
    .filter(res => true);
     
  }
  ngOnInit(){
   Observable.fromEvent(document.getElementById("reset-button"), 'click')
   .debounceTime(500)
   .subscribe(event => {
     this.scriptName = '';
     console.log('clicked');
    });

    Observable.fromEvent(document.querySelector("input"), 'input')
    // .debounceTime(500)
    .subscribe(event => {
      this.inputCount = this.inputCount - this.scriptName.length;
      console.log('clicked');
     });

  }

  changeInScriptName(scriptName) {
    this.scriptsLatest.next(scriptName);
  }
}
