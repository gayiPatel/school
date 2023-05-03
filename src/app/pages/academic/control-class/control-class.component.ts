import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-control-class',
  templateUrl: './control-class.component.html',
  styleUrls: ['./control-class.component.scss']
})
export class ControlClassComponent {

  ClassForm:  FormGroup
  sectionForm: FormGroup
  editClass: FormGroup
  editSection : FormGroup
  isLoading: boolean;
  sections: any[] = [];
  classes: any[] = [];
  selectedDesign: any;
  _id: string;

  constructor(private api: ApiService, private toastr: ToastrService,  private route: ActivatedRoute,) {
    this.ClassForm = new FormGroup({
      className: new FormControl(null, [Validators.required]),
      // sections: new FormControl(null, [Validators.required]),
      sections: new FormControl('select', [Validators.required]),

      classNumeric: new FormControl(null, [Validators.required])
  

    });

    this.sectionForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      capacity: new FormControl(null, [Validators.required]),


    });
    this.editClass = new FormGroup({
       
      //  classId: new FormControl(null, [Validators.required]),

      className: new FormControl(null, [Validators.required]),
    
      sections: new FormControl(null, [Validators.required]),

      classNumeric: new FormControl(null, [Validators.required])
  

    });
    
    this.editSection = new FormGroup({
      
      sectionId: new FormControl(null, [Validators.required]),

      name: new FormControl(null, [Validators.required]),
      capacity: new FormControl(null, [Validators.required]),


    });

  }

  ngOnInit(): void {
  
    
    this.getAllSection();
    this.getAllClass()
  }
  setClass(dept: any)
  {

    console.log(dept);
    
    this.selectedDesign = dept;

    this.editClass.patchValue({
      // classId: dept._id,
      className: dept.className,
      classNumeric: dept.classNumeric,
      sections: dept.sections[0]?.name,

    });

   
  }
  setSection(dept: any)
  {

    console.log(dept);
    
    this.selectedDesign = dept;

    this.editSection.patchValue({
      sectionId: dept._id,
      name: dept.name,
      capacity: dept.capacity,
    
    });

   
  }
  getAllSection(){
   
  
      this.api.getAllSection().subscribe(resp => {
        console.log(resp);
        
        this.sections = resp.sections
      });
  
  }

  getAllClass(){
   
  
    this.api.getAllClass().subscribe(resp => {
      console.log(resp);
      
      this.classes = resp.classes
    });

}


  addClass()
  {
    this.isLoading = true;
    this.api.addClass( this.ClassForm.value).subscribe(resp => {
      console.log(resp);

      this.isLoading = false;

      this.toastr.success(resp.message, "Department add success");
      // this.designForm.reset();
      // this.getDesignations();
    ;
    },
    (err) => {
      this.isLoading = false;
      this.toastr.error(err, "Department add failed");
      console.error(err);
    })
  }

  addSection()
  {
    this.isLoading = true;
    this.api.addSection(this.sectionForm.value).subscribe(resp => {
      console.log(resp);

      this.isLoading = false;

      this.toastr.success(resp.message, "Section  add success");
      // this.designForm.reset();
      // this.getDesignations();
    ;
    },
    (err) => {
      this.isLoading = false;
      this.toastr.error(err, "section add failed");
      console.error(err);
    })
  }

  deleteClass(){

    this.isLoading = true;
    this.api.deleteClass(this.selectedDesign._id).subscribe(resp => {
      console.log(resp);
      this.isLoading = false;
      document.getElementById('modalDismissBtn')?.click();
      this.getAllClass()
    },
    (err) => {
      this.isLoading = false;
      console.error(err);
    })
  }
  deleteSection(){

    this.isLoading = true;
    this.api.deleteSection(this.selectedDesign._id).subscribe(resp => {
      console.log(resp);
      this.isLoading = false;
      document.getElementById('modalDismissBtn')?.click();
      this.getAllSection()
    },
    (err) => {
      this.isLoading = false;
      console.error(err);
    })
  }
  updateClass(){
    this.isLoading = true;
    console.log(":this.editDistForm.value", this.editClass.value);
    
    this.api.updateclass(this.selectedDesign._id, this.editClass.value).subscribe(resp => {
      console.log(resp);
      
      this.isLoading = false;
      this.toastr.success(resp.message, "  update success");
      document.getElementById('editModalDismissBtn')?.click();
      this.getAllClass();
    },
    (err) => {
      this.isLoading = false;
      this.toastr.error(err, "E update failed");
    })

  }
  updateSection(){
    this.isLoading = true;
    console.log(":this.editDistForm.value", this.editSection.value);
    
    this.api.updateSection(this.editSection.value).subscribe(resp => {
      console.log(resp);
      
      this.isLoading = false;
      this.toastr.success(resp.message, "  update success");
      document.getElementById('editModalDismissBtn')?.click();
      this.updateSection();
    },
    (err) => {
      this.isLoading = false;
      this.toastr.error(err, "E update failed");
    })

  }
}
