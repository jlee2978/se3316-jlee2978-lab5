import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverUrl } from './../environments/environment';
import { Observable } from 'rxjs';
import { IGenre } from './genre';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = serverUrl;

  constructor(private http: HttpClient) { }

  // below methods results of URL ReST calls (calling server backend API routes)
  createUser(user): Observable<any> {
    return this.http.post<any>(this.url + "createuser", user);
  }

  getUsers(loginid): Observable<any> {
    if (loginid == "") {
      return this.http.get<any>(this.url + "getusers");
    }
    else {
      return this.http.get<any>(this.url + "getuser/" + loginid);
    }
  }

  saveUser(user): Observable<any> {
    return this.http.put<any>(this.url + "updateuser/" + user._id, user);
  }

  getReviews(songid): Observable<any> {
    return this.http.get<any>(this.url + "getreviews/" + songid);
  }

  getSongs(searchSong): Observable<any> {
    return this.http.post<any>(this.url + "getsongs/" + searchSong.loginid, searchSong);
  }

  // includes creating initial review if any
  createSong(song): Observable<any> {
    return this.http.post<any>(this.url + "createsong", song);
  }

  // includes updating review
  updateSong(song): Observable<any> {
    return this.http.put<any>(this.url + "updatesong/" + song._id, song);
  }

  // we use an array instead of data schema model from mongoDB
  getGenres(): IGenre[] {
		let genres =
			[
				{ id: 0, name: 'Blues' },
				{ id: 1, name: 'Country' },
				{ id: 2, name: 'Folk' },
				{ id: 3, name: 'Electronic' },
				{ id: 4, name: 'Hip-Hop' },
				{ id: 5, name: 'Jazz' },
				{ id: 6, name: 'Pop' },
				{ id: 7, name: 'R&B' },
				{ id: 8, name: 'Rap' },
				{ id: 9, name: 'Rock' },
				{ id: 10, name: 'Other' }
			];

		return genres;
	}




}
