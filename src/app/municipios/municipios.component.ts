import {Component, OnInit, ViewChild,  ElementRef, NgZone} from '@angular/core';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../services/firestore/firestore.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MapsAPILoader, MouseEvent } from '@agm/core';


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
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('exampleModal', {static: true}) private modal;
  @ViewChild('search', {static: false}) private searchElementRef: ElementRef;
  @ViewChild('alertSwal', {static: true}) private alertSwal: SwalComponent;
  constructor(
    private firestoreService: FirestoreService,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {

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
      zonas: new FormControl('', Validators.required),
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

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // tslint:disable-next-line:new-parens
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }



  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
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
        longitud: municipio.data.longitud,
        zonas: municipio.data.zonas,
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
      longitud: form.longitud,
      zonas: form.zonas
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
      zonas: '',
      id: ''
    });
  }


}
