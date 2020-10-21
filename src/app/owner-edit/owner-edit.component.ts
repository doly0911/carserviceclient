import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { OwnerService } from '../shared/owner/owner.service';
import { CarService } from '../shared/car/car.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit {
  owner: any = {};
  sub: Subscription;
  oldOwner : boolean = true;

  constructor(private carService: CarService,
              private route: ActivatedRoute,
              private router: Router,
              private ownerService: OwnerService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const dni = params['dni'];
      if (dni) {
        this.ownerService.get(dni).subscribe((owner: any) => {
          if (owner) {
            this.oldOwner = false;
            this.owner = owner._embedded.owners[0];
            this.owner.href = this.owner._links.self.href;
            //this.giphyService.get(owner.name).subscribe(url => car.giphyUrl = url);
          } else {
            console.log(`Owner with id '${dni}' not found, returning to list`);
            this.gotoList();
          }
        });
      }else{
        this.oldOwner = true;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save(form: NgForm) {
    this.ownerService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  remove(href,dni) {
    //Obtain all cars from my API /cars
    this.carService.getAllCars().subscribe(result =>{
      let cars = result._embedded.cars;
      //Filtro por el dni del propietario que tiene asignado un carro
      let ownerCars = cars.filter((car)=>{
        return car.ownerDni == dni
      })
      //Recorro cada carro asociado con el dni que deseo eliminar
      ownerCars.forEach(car => {
        //href es la información completa de un carro
        car.href = car._links.self.href,
        //modifico el atributo asociado con Owner
        car.ownerDni = null
        //guardo los nuevos datos del carro
        this.carService.save(car).subscribe(result => {
          console.log(result);
        }, error => console.error(error));

      });

    })
    //Procedo a continuar con la eliminación del Owner
    this.ownerService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

}
