import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ofType} from '@ngrx/effects';
import {ActionsSubject} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {ServiceFactory} from '../ServiceFactory';
import {CREATE_ENTITY_SUCCESS} from '../store/entity-actions';

@Component({
  selector: 'app-schema-create',
  templateUrl: 'schema-create.component.html'
})

export class SchemaCreateComponent implements OnInit, OnDestroy {

  service = this.serviceFactory.createHandler('schema');
  isPending$ = this.service.isCreatePending();
  form = new FormGroup({
    'name': new FormControl(''),
    'namespaceRoot': new FormControl(''),
    'persistance': new FormGroup({
      'dbName': new FormControl('')
    }),
    'entities': new FormArray([])
  });

  subs = [];

  constructor(public serviceFactory: ServiceFactory, private actionsSubject: ActionsSubject) {
  }

  createEntity = () => new FormGroup({
      'name': new FormControl(''),
      'pluralName': new FormControl(''),
      'fields': new FormArray([]),
      'operations': this.createOperations()
    }
  );

  createOperations = () => new FormGroup({
      'create': new FormGroup({
        'isActive': new FormControl(true),
        'isGenerated': new FormControl(true),
        'isAuthActive': new FormControl(true)
      }),
      'list': new FormGroup({
        'isActive': new FormControl(true),
        'isGenerated': new FormControl(true),
        'isAuthActive': new FormControl(true)
      }),
      'byId': new FormGroup({
        'isActive': new FormControl(true),
        'isGenerated': new FormControl(true),
        'isAuthActive': new FormControl(true)
      }),
      'patch': new FormGroup({
        'isActive': new FormControl(true),
        'isGenerated': new FormControl(true),
        'isAuthActive': new FormControl(true)
      }),
      'update': new FormGroup({
        'isActive': new FormControl(true),
        'isGenerated': new FormControl(true),
        'isAuthActive': new FormControl(true)
      }),
      'delete': new FormGroup({
        'isActive': new FormControl(true),
        'isGenerated': new FormControl(true),
        'isAuthActive': new FormControl(true)
      }),
    }
  );

  createField = () => new FormGroup({
    'name': new FormControl(''),
    'type': new FormControl('', Validators.required),
    'isRequired': new FormControl(false),
    'isReadonly': new FormControl(false),
    'isUnique': new FormControl(false),
    'valueTransformer': new FormControl(''),
  });

  removeField = (i, j) => {
    const entities = (<FormArray>this.form.get('entities'));
    (<FormArray>entities.at(i).get('fields')).removeAt(j);
  };

  removeEntity = i => {
    (<FormArray>this.form.get('entities')).removeAt(i);
  };

  addEntity() {
    (<FormArray>this.form.get('entities')).push(this.createEntity());
  }

  addField(i) {
    const entities = (<FormArray>this.form.get('entities'));
    const fields = (<FormArray>entities.at(i).get('fields'));
    fields.push(this.createField());
  }

  submit = () => {
    this.service.create(this.form.value);
  };

  back = () => {
    this.service.disableCreateMode();
  };

  ngOnInit() {
    const sub1 = this.actionsSubject
      .pipe(
        ofType(CREATE_ENTITY_SUCCESS),
        tap(() => {
          this.service.fetchAll();
          this.service.disableCreateMode();
        })
      )
      .subscribe();

    this.subs.push(sub1);
  }


  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
