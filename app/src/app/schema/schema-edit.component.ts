import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ofType} from '@ngrx/effects';
import {ActionsSubject} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {ServiceFactory} from '../ServiceFactory';
import {UPDATE_ENTITY_SUCCESS} from '../store/entity-actions';

@Component({
  selector: 'app-schema-edit',
  templateUrl: 'schema-create.component.html'
})

export class SchemaEditComponent implements OnInit, OnDestroy {

  @Input() schema$;

  service = this.serviceFactory.createHandler('schema');
  isPending$ = this.service.isUpdatePending();
  form;
  subs = [];
  operationLabels = ['create', 'list', 'byId', 'patch', 'update', 'delete'];

  constructor(public serviceFactory: ServiceFactory,
              private actionsSubject: ActionsSubject) {
  }

  createEntity = entity => new FormGroup({
      'name': new FormControl(entity.name),
      'pluralName': new FormControl(entity.pluralName),
      'fields': new FormArray(entity.fields.map(this.createField)),
      'operations': this.createOperations(entity.operations),
    }
  );

  createOperations = operations => new FormGroup(
    this.operationLabels.reduce((acc, cr) => ({
      ...acc, [cr]: new FormGroup({
        'isActive': new FormControl(operations[cr].isActive),
        'isGenerated': new FormControl(operations[cr].isGenerated),
        'isAuthActive': new FormControl(operations[cr].isAuthActive)
      }),
    }), {})
  );

  createField = field => new FormGroup({
    'name': new FormControl(field.name),
    'type': new FormControl(field.type, Validators.required),
    'isRequired': new FormControl(field.isRequired),
    'isReadonly': new FormControl(field.isReadonly),
    'isUnique': new FormControl(field.isUnique),
    'valueTransformer': new FormControl(field.valueTransformer),
  });

  checkAll = (i, e) => {
    this.operationLabels.forEach(operation => {
      (<FormArray>this.form.get('entities'))
        .at(i)
        .get('operations')
        .get(operation)
        .get('isActive')
        .patchValue(e.checked);
    });

  };

  removeField = (i, j) => {
    const entities = (<FormArray>this.form.get('entities'));
    (<FormArray>entities.at(i).get('fields')).removeAt(j);
  };

  removeEntity = i => {
    (<FormArray>this.form.get('entities')).removeAt(i);
  };

  addEntity() {
    (<FormArray>this.form.get('entities')).push(new FormGroup({
      'name': new FormControl(''),
      'pluralName': new FormControl(''),
      'fields': new FormArray([]),
      'operations': new FormGroup(this.operationLabels.reduce((acc, cr) => ({
        ...acc, [cr]: new FormGroup({
          'isActive': new FormControl(true),
          'isGenerated': new FormControl(true),
          'isAuthActive': new FormControl(true)
        }),
      }), {}))
    }));
  }

  addField(i) {
    const entities = (<FormArray>this.form.get('entities'));
    const fields = (<FormArray>entities.at(i).get('fields'));
    fields.push(new FormGroup({
      'name': new FormControl(''),
      'type': new FormControl('', Validators.required),
      'isRequired': new FormControl(false),
      'isReadonly': new FormControl(false),
      'isUnique': new FormControl(false),
      'valueTransformer': new FormControl(''),
    }));
  }

  submit = () => {
    this.service.update(this.form.value);
  };

  back = () => {
    this.service.resetAllEditedIds();
  };

  ngOnInit() {
    const sub1 = this.actionsSubject
      .pipe(
        ofType(UPDATE_ENTITY_SUCCESS),
        tap(() => {
          this.service.fetchAll();
          this.service.resetAllEditedIds();
        })
      )
      .subscribe();


    const sub2 = this.schema$
      .pipe(
        tap((schema: any) => {
          this.form = new FormGroup({
            'id': new FormControl(schema._id),
            'name': new FormControl(schema.name),
            'namespaceRoot': new FormControl(schema.namespaceRoot),
            'persistance': new FormGroup({
              'dbName': new FormControl(schema.persistance.dbName)
            }),
            'entities': new FormArray(schema.entities.map(this.createEntity))
          });
        }),
      )
      .subscribe();

    this.subs.push(sub1, sub2);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
