import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Car } from '../../domain/car';
import { CarService } from '../../service/carservice';
import { Table } from 'primeng/table';

@Component({
  selector: 'table-virtual-scroll-lazy-demo',
  templateUrl: 'table-virtual-scroll-lazy-demo.html',
})
export class TableVirtualScrollLazyDemo implements OnInit {
  cars!: Car[];

  virtualCars!: Car[];

  cols!: any[];

  @ViewChild(Table, { static: true })
  table: Table;

  scroll: boolean = true;

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' },
    ];

    this.cars = Array.from({ length: 1000 }).map((_, i) =>
      this.carService.generateCar(i + 1)
    );
    this.virtualCars = Array.from({ length: 1000 });    
  }

  loadCarsLazy(event: LazyLoadEvent) {
    //simulate remote connection with a timeout
    setTimeout(() => {
      //load data of required page
      let loadedCars = this.cars.slice(event.first, event.first + event.rows);

      //populate page of virtual cars
      Array.prototype.splice.apply(this.virtualCars, [
        ...[event.first, event.rows],
        ...loadedCars,
      ]);

      //trigger change detection
      event.forceUpdate();
      if (this.scroll) {
        this.table.scrollToVirtualIndex(250);
        this.scroll = false;
      }
    }, Math.random() * 1000 + 250);
  }
}
