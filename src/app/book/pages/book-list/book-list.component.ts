import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookItemComponent } from '../../components/book-item/book-item.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForOf } from '@angular/common';
import { map, Observable } from 'rxjs';



@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'author', 'isbn', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,
    private api: ApiService) { }

  openDialog() {
    this.dialog.open(BookItemComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      this.getAllItems();
    })
  }

  getAllItems() {
    this.api.getItem()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
        },
        error: (err) => {
          alert("Error while fetching data")
        }
      })
  }

  ngOnInit(): void {
    this.getAllItems();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editItem(row: any) {
    this.dialog.open(BookItemComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllItems();
      }
    })
  }

  deleteItem(id: number) {
    this.api.deleteItem(id)
      .subscribe({
        next: (res) => {
          this.getAllItems();
        }
      })
  }

  deleteAllItems() {
    this.api.getItem().pipe(map((x:any)=>
    {
      for (let data of x.id) {
        this.deleteItem(data)
      }
    }));
  }

}
