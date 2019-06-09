import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, Marker, Polyline } from '@ionic-native/google-maps/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  map: GoogleMap;
  markers: Marker[] = [];
  polyline: Polyline;

  constructor(private platform: Platform) { }

  async ngOnInit() {
    await this.platform.ready();
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas", {
      controls: {
        myLocation: true,
        myLocationButton: true,
        zoom: true
      }
    }); //Es el mismo del div de la pagina
    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(this.onMapClick.bind(this));
  }

  private async onMapClick(params: any[]) {
    const position: LatLng = params[0];
    
    const marker: Marker = await this.map.addMarker({
      title: `Punto ${this.markers.length + 1}`,
      position: position
    });

    this.markers.push(marker);

    marker.showInfoWindow();
  }

  async drawRoute() {
    if(this.polyline) { //Si ya hay una linea la eliminamos
      this.polyline.remove();
    }

    //Creamos una lista de posiciones (lat, lon)
    const positions: LatLng[] = this.markers.map(marker => {
      return new LatLng(marker.getPosition().lat, marker.getPosition().lng);
    });

    //Crear linea
    this.polyline = await this.map.addPolyline({
      points: positions,
      clickable: false,
      geodesic: true
    });

    //Mostramos los markers
  }

  clearRoute() {
    this.markers.forEach(marker => {
      marker.remove();
    });

    if(this.polyline) {
      this.polyline.remove();
    }
    
    this.markers = [];
  }

}
