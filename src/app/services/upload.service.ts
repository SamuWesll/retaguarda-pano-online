import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';  
import { map } from  'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  SERVER_URL: string = "http://localhost:4200/assets/";

  constructor(private httpClient: HttpClient) { }

  onUpload(formData: File) {
    const FD = new FormData();
    FD.append('foto', formData)
    return this.httpClient.post('http://localhost:8080/meupanoonline/fotos', FD)
  }

} 
