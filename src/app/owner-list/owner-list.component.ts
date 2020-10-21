import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';
import { CarService } from '../shared/car/car.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;
  typesOfShoes: Array<any>;
  owners_selected: string[]

  constructor(private ownerService: OwnerService,
              private carService: CarService,
              private router: Router) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      this.owners = data._embedded.owners;
    });
  }

  remove(href,dni){
    this.removeOneOwner(href,dni,()=>{
      this.gotoList();
    })
  }

  removeSelected(owners){
    const length = owners.length;
    owners.forEach(owner => {
      this.removeOneOwner(owner.value._links.self.href, owner.value.dni,()=>{
          this.owners.splice (this.owners.indexOf(owner.value), 1);
      })
    });
  }

  removeOneOwner(href,dni,callback) {
    this.carService.getAllCars().subscribe(result =>{
      let cars = result._embedded.cars;
      let ownerCars = cars.filter((car)=>{
        return car.ownerDni == dni
      })

      ownerCars.forEach(car => {
        car.href = car._links.self.href,
        car.ownerDni = null
        this.carService.save(car).subscribe(result => {
          console.log(result);
        }, error => console.error(error));
      });
    })

    this.ownerService.remove(href).subscribe(result => {
      callback()
    }, error => console.error(error));
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  gotoCarList() {
    this.router.navigate(['/car-list']);
  }

}
