import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/Services/notes.service';
import jwt_decode from "jwt-decode";
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  allNotes = [];
  emptyNotes = "";
  isEmpty = true;
  token;
  decoded;
  isLoad = false;
  NOTE_ID;
  constructor(private _NotesService:NotesService,private _Router:Router) { 
    try {
      this.token = localStorage.getItem('TOKEN');
      this.decoded = jwt_decode(this.token);
    } catch (error) {
      localStorage.clear();
      this._Router.navigate(['/signin']);
    }
    this.getAllNotes();
  }
  AddNote = new FormGroup({
    title : new FormControl('' , Validators.required),
    desc : new FormControl('' , Validators.required)
  })
  EditNote = new FormGroup({
    title : new FormControl('' , Validators.required),
    desc : new FormControl('' , Validators.required)
  })
  getAllNotes()
  {
    let data = {
      token : this.token,
      userID: this.decoded._id
    }
    this._NotesService.getAllNotes(data).subscribe(res => {
      this.isLoad = true;
      if(res.message == 'success')
      {
        this.isEmpty = false;
        this.allNotes = res.Notes;
      } else {
        this.isLoad = false;
        this.isEmpty = true;
        this.emptyNotes = res.message;
      }
    })
  }
  addData()
  {
    let data = {
      title : this.AddNote.value.title,
      desc : this.AddNote.value.desc,
      token : this.token,
      citizenID : this.decoded._id
    }
    this._NotesService.addNote(data).subscribe(res => {
      if(res.message == "success")
      {
        $("#AddNote").modal('hide');
        this.getAllNotes();
        this.AddNote.reset();
      }
    })
  }
  getID(id)
  {
    this.NOTE_ID = id;
  }
  deleteNote()
  {
    let data = {
      NoteID : this.NOTE_ID,
      token : this.token
    }
    this._NotesService.deleteNote(data).subscribe(res => {
      if(res.message == "deleted")
      {
        $("#deleteNote").modal('hide');
        this.getAllNotes();
      }
    })
  }
  setValue()
  {
    for (let i = 0; i < this.allNotes.length; i++) {
      if(this.allNotes[i]._id == this.NOTE_ID)
      {
        this.EditNote.controls.title.setValue(this.allNotes[i].title);
        this.EditNote.controls.desc.setValue(this.allNotes[i].desc);
      }
    }
  }
  editNote()
  {
    let data = {
      title : this.EditNote.value.title,
      desc : this.EditNote.value.desc,
      NoteID : this.NOTE_ID,
      token : this.token
    }
    this._NotesService.editNote(data).subscribe(res => {
      if(res.message == "updated")
      {
        $("#editNote").modal('hide');
        this.getAllNotes();
      }
    })
  }
  ngOnInit(): void {
  }
}