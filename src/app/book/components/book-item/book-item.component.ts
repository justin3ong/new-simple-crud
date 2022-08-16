import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss']
})
export class BookItemComponent implements OnInit {

  newForm !: FormGroup;
  actionBtn: string = "Save/Submit"
  constructor(private fb: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<BookItemComponent>) { }

  ngOnInit(): void {
    this.newForm = this.fb.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      isbn: ['',[Validators.required]]
    });
    if(this.editData){
      this.actionBtn="Update";
      this.newForm.controls['id'].setValue(this.editData.id);
      this.newForm.controls['title'].setValue(this.editData.title);
      this.newForm.controls['author'].setValue(this.editData.author);
      this.newForm.controls['isbn'].setValue(this.editData.isbn)
    }
  }
  addItem(){
    if(!this.editData){
      if(this.newForm.valid){
        this.api.postItem(this.newForm.value).subscribe({
          next:(res)=>{
            alert("Item added successfully");
            this.newForm.reset();
            this.dialogRef.close('saved');
          },
          error:()=>{
            alert("Error adding the product")
          }
        })
      }
    }
    else{
      this.updateItem();
    }
  }

  updateItem(){
    this.api.putItem(this.newForm.value, this.editData.id).
    subscribe({
      next:(res)=>{
        alert("Item updated successfully");
        this.newForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error in updating item")
      }
    })
  }
  


}
