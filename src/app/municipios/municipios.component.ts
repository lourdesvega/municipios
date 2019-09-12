import {Component, OnInit, ViewChild} from '@angular/core';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../services/firestore/firestore.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.css']
})
export class MunicipiosComponent implements OnInit {

  public municipios = [];
  public municipio;
  public documentId = null;
  public currentStatus = 1;
  public newMunicipioForm;
  // @ts-ignore
  @ViewChild('exampleModal') private modal;
  // @ts-ignore
  @ViewChild('alertSwal') private alertSwal: SwalComponent;


  constructor(private firestoreService: FirestoreService, private modalService: NgbModal) {

    this.newMunicipioForm = new FormGroup({
      clave: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      significado: new FormControl('', Validators.required),
      cabecera: new FormControl('', Validators.required),
      superficie: new FormControl('', Validators.required),
      altitud: new FormControl('', Validators.required),
      clima: new FormControl('', Validators.required),
      latitud: new FormControl('', Validators.required),
      longitud: new FormControl('', Validators.required),
      id: new FormControl('')
    });
  }

  ngOnInit() {
    this.firestoreService.getMunicipios().subscribe((municipiosSnapshot) => {
      this.municipios = [];
      municipiosSnapshot.forEach((municipioData: any) => {
        this.municipios.push({
          id: municipioData.payload.doc.id,
          data: municipioData.payload.doc.data()
        });
      });
    });
  }

  public openModal(content, newMunicipioForm, municipio = null) {
    this.municipio = municipio;
    this.currentStatus = 1;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then((result) => {
      this.resetForm();
    }, (reason) => {
      this.resetForm();
    });
    if (municipio != null) {
      this.newMunicipioForm.setValue({
        id: municipio.id,
        clave: municipio.data.clave,
        municipio: municipio.data.municipio,
        significado: municipio.data.significado,
        cabecera: municipio.data.cabecera,
        superficie: municipio.data.superficie,
        altitud: municipio.data.altitud,
        clima: municipio.data.clima,
        latitud: municipio.data.latitud,
        longitud: municipio.data.longitud
      });
      this.currentStatus = 2;
    }
  }

  public delete(municipio) {
    this.firestoreService.deleteMunicipio(municipio);
  }

  public update(municipio, data) {
    this.firestoreService.updateMunicipio(this.municipio, data).then(() => {
      this.resetForm();
      this.alertSwal.title = 'Correcto';
      this.alertSwal.type = 'success';
      this.alertSwal.text = 'Municipio modificado';
      this.alertSwal.fire();
      this.modalService.dismissAll();
      this.municipio = null;
    }, (error) => {
    });
  }

  public newMunicipio(data) {
    this.firestoreService.createMunicipio(data).then(() => {
      this.resetForm();
      this.alertSwal.title = 'Correcto';
      this.alertSwal.type = 'success';
      this.alertSwal.text = 'Municipio agregado';
      this.alertSwal.fire();
      this.modalService.dismissAll();
    }, (error) => {
    });
  }

  public upsert(form) {
    const data = {
      clave: form.clave,
      municipio: form.municipio,
      significado: form.significado,
      cabecera: form.cabecera,
      superficie: form.superficie,
      altitud: form.altitud,
      clima: form.clima,
      latitud: form.latitud,
      longitud: form.longitud
    };
    if (this.currentStatus === 1) {
      this.newMunicipio(data);
    } else {
      this.update(this.municipio, data);
    }
  }

  public resetForm() {
    this.newMunicipioForm.setValue({
      clave: '',
      municipio: '',
      significado: '',
      cabecera: '',
      superficie: '',
      altitud: '',
      clima: '',
      latitud: '',
      longitud: '',
      id: ''
    });
  }


}
