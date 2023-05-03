import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  sections: any[] = [];
  classes: any[] = [];
  subjects: any[] = [];
  reportForm: FormGroup;
  studentData: any;
  modalRef!: BsModalRef;
  studentId:any;
  studentSelRow:any;
  aceYear = [{ _id: "2020-2021", name: "2020-2021" }, { _id: "2021-2022", name: "2021-2022" }, { _id: "2022-2023", name: "2022-2023" }];
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private modalService: BsModalService
) {
   this.addForm();
  }
  ngOnInit(): void {  
    this.getAllClass();
    // this.getAllSection();
    
  }
  addForm() {
    this.reportForm = new FormGroup({
      studentClass: new FormControl(null, [Validators.required]),
      section: new FormControl(null, [Validators.required]),
      academicYear: new FormControl(null, [Validators.required])
    })
  }
  onChangeClass(event){
    this.sections =[];
    this.reportForm.patchValue({section: 'select'});
    const id = event.target.value;
    this.classes.forEach(element => {
        if(element._id === id) {
          this.sections = element.sections;
        }
    });
  }
  getAllSection() {
    this.api.getAllSection().subscribe(resp => {
      this.sections = resp.sections
    });
  }
  getAllClass() {
    this.api.getAllClass().subscribe(resp => {
      this.classes = resp.classes
    });
  }
  callReport(reportForm){
    const data = {
      academicYear: reportForm.value.academicYear,
      section: reportForm.value.section,
      studentClass: reportForm.value.studentClass,
    }
    this.api.studentList(data).subscribe(data => {
      this.studentData = data['students'];
    },
    (err) =>{
      this.studentData =[];
      this.toastr.error(err);
    })
  }
  openQuickModal(template: TemplateRef<any>, data: any){
    this.studentSelRow = data;
    this.modalRef = this.modalService.show(template);
  }
  openDeleteModal(template: TemplateRef<any>, data: any){
    this.studentId = data._id;
    this.modalRef = this.modalService.show(template);
  }
  deletePopup(){
    /*this.api.deleteHomeWork(this.studentId).subscribe(resp => {
      this.closePopup();
      this.toastr.success(resp.message, "Deleted success");
      this.callReport(this.reportForm );
    },
    (err) => {
      this.toastr.error(err, " update failed");
      console.error(err);
    })*/
  }
  closePopup(){
    this.modalRef.hide();
  }
  editClick(student:any) {
    this.router.navigate(['/student-details/student-view/', student._id]);
  }
}
