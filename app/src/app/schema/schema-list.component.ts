import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ofType} from '@ngrx/effects';
import {ActionsSubject} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ServiceFactory} from '../ServiceFactory';
import {DELETE_ENTITY_SUCCESS} from '../store/entity-actions';

@Component({
  selector: 'app-schema-list',
  templateUrl: 'schema-list.component.html',
})

export class SchemaListComponent implements OnInit, OnDestroy {

  service = this.serviceFactory.createHandler('schema');
  schemas = this.service.getAll();
  subs = [];

  fileToUpload;

  constructor(public serviceFactory: ServiceFactory,
              private http: HttpClient,
              private actionsSubject$: ActionsSubject) {
  }

  ngOnInit() {
    this.service.fetchAll();
    const sub = this.actionsSubject$.pipe(
      ofType(DELETE_ENTITY_SUCCESS),
      tap(() => {
        this.service.fetchAll();
      })
    )
      .subscribe();
    this.subs.push(sub);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity() {
    const formData: FormData = new FormData();
    formData.append('import', this.fileToUpload, this.fileToUpload.name);
    return this.http
      .post('http://localhost:8080/import-schema', formData)
      .pipe(catchError(e => of(e)))
      .subscribe(() => {
        this.service.fetchAll();
        this.fileToUpload = null;
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }


}


