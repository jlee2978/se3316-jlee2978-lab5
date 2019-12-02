import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from './../authentication.service';
import { ApiService } from './../api.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IResponse } from './../response';
import { Observable, Subscription } from 'rxjs'
import { ISong } from './../song';
import { IGenre } from './../genre';
import { ReviewdialogComponent } from './../reviewdialog/reviewdialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  @ViewChild('titleSearch', { static: false }) titleSearch: ElementRef;

  public isLoggedIn: String;
  public isAdmin: String;
  public showReview: boolean = false;
  public selectedSong: number;
  public songs: ISong[] = [];
  public searchSong: ISong = { _id: null, title: null, artist: null, album: null, year: null, comment: null, track: null, genre: null, hidden: null, note: null, rating: null, review_rating: null, date: null, loginid: null };
  public genres: IGenre[] = [];
  public response: IResponse;
  public errorMessage: String;

  constructor(private authService: AuthenticationService, private apiService: ApiService, public dialog: MatDialog) { }


  ngOnInit() {
    this.isLoggedIn = this.authService.loggedIn() ? 'Y' : 'N';
    this.isAdmin = this.authService.getLoginRole() == 'admin' ? 'Y' : 'N';

    // searching songs that belongs to login user
    this.searchSong.loginid = localStorage.getItem('userid');
    this.genres = this.apiService.getGenres();

    if (this.isLoggedIn == 'Y') {
      this.songs.push({ _id: null, title: null, artist: null, album: null, year: null, comment: null, track: null, genre: null, hidden: null, note: null, rating: null, review_rating: null, date: null, loginid: null });
    }
  }

  ngAfterViewInit() {
    this.titleSearch.nativeElement.focus();
  }

  getSongs(searchSong) {
    // this.genres = this.apiService.getGenres();	  

    this.errorMessage = '';
    this.songs = [];

    this.apiService.getSongs(searchSong).subscribe(
      response => {
        this.response = response;

        for (let i = 0; i < response.songs.length; i++) {
          this.songs.push({
            _id: response.songs[i]._id,
            title: response.songs[i].title,
            artist: response.songs[i].artist,
            album: response.songs[i].album,
            year: response.songs[i].year,
            comment: response.songs[i].comment,
            track: response.songs[i].track,
            genre: response.songs[i].genre,
            hidden: response.songs[i].hidden,
            note: null,
            rating: response.songs[i].rating,
            review_rating: null,
            date: response.songs[i].date,
            loginid: response.songs[i].loginid
          })
        }

        if (this.isLoggedIn == 'Y') {
          // add a new row for user to create new song if needed
          this.songs.push({ _id: null, title: null, artist: null, album: null, year: null, comment: null, track: null, genre: null, hidden: null, note: null, rating: null, review_rating: null, date: null, loginid: null });
        }
      }
    );
  }

  saveSong(song, i) {
    if (this.isLoggedIn !== 'Y') {
      return
    }

    song.loginid = localStorage.getItem('userid');

    if (!song.title) {
      this.errorMessage = "Song title is required";
      return;
    }

    if (!song.artist) {
      this.errorMessage = "Song artist is required";
      return;
    }


    song.title = this.sanitize(song.title);
    song.artist = this.sanitize(song.artist);
    song.album = this.sanitize(song.album);
    song.comment = this.sanitize(song.comment);
    song.note = this.sanitize(song.note);

    if (song._id == null) {
      this.apiService.createSong(song).subscribe(
        response => {
          this.response = response;
          this.songs[i] = response.song;

          // if the new song is added successfully
          // then add a new song at the end of the table
          this.songs.push({ _id: null, title: null, artist: null, album: null, year: null, comment: null, track: null, genre: null, hidden: null, note: null, rating: null, review_rating: null, date: null, loginid: null });
        }
      );
    }
    else {
      this.apiService.updateSong(song).subscribe(
        response => {
          this.response = response;
          this.songs[i] = response.song;
          if (response.error.code !== 0) {
            this.errorMessage = response.error.message;
          }
        }
      );
    }

    this.songs[i].note = null;
    this.songs[i].review_rating = null;
  }

  // Sanitize data
  sanitize(data: any) {
    if (data) {
      return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    else {
      return data;
    }
  }

  showReviews(song) {
    this.apiService.getReviews(song._id).subscribe(response => {
      this.dialog.open(ReviewdialogComponent, { height: '600px', width: '800px', data: { song: song, reviews: response.reviews } });
    });
  }
}
