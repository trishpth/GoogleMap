import { Component } from '@angular/core';
import { MouseEvent } from '@agm/core';
import {MapsService} from './maps.service';
import * as converter from 'xml-js';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  // google maps zoom level
  zoom: number = 8;
  
  // initial center position for the map
  lat = 1;
  lng = 3;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  country = "";
  calling_code = "";
  city = "";
  ip = 0;
  location: Object;
  img = 'https://live.staticflickr.com/{server}/{id}_{server}_o.{o-format}';
  url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ca370d51a054836007519a00ff4ce59e';
  constructor(private map: MapsService) {}

  markers: marker[] = []

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.map.getLocation().subscribe((data) => {
      console.log(data);
      this.lat = data.latitude;
      this.lng = data.longitude;
      this.country = data.country_name;
      this.calling_code = data.country_calling_code;
      this.city = data.city;
      this.ip = data.ip;
      this.markers.push( {
        lat: this.lat,
        lng: this.lng,
        label: 'A',
        draggable: true
      })

      
      this.setImageSrc(this.lat,this.lng)

    });

    
  }
  
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }
  
  src = [];
  markerDragEnd(m: marker, $event: any) {
    console.log('dragEnd', m, $event);
    // &lat=28.6519&lon=77.2315
    this.setImageSrc($event.coords.lat,$event.coords.lng)
  }
  
  setImageSrc(lat,lng){
    this.src = [];
    
    let newUrl = this.url +`&lat=${lat}&lon=${lng}`;
    this.map.getImageData(newUrl).subscribe((data)=>{
      console.log(data);
      let result1 = converter.xml2json(data, {compact: true, spaces: 2});

      const JSONData = JSON.parse(result1);
      console.log(JSONData);

      JSONData.rsp.photos.photo.forEach(el => {
        console.log(el._attributes);
        let img = `https://live.staticflickr.com/${el._attributes.server}/${el._attributes.id}_${el._attributes.secret}_w.jpg`;
        this.src.push(img);
      });
      
      
      console.log(this.src[0]);

      // this
    });
  }
}

// just an interface for type safety.
interface marker {
	lat: any;
	lng: any;
	label?: string;
	draggable: boolean;
}
