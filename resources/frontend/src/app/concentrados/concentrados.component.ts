import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppsListService } from '../apps-list/apps-list.service';

@Component({
    selector: 'app-concentrados',
    template: `Oops, You shouldn't be here...`,
    styles: []
})
export class ConcentradosComponent implements OnInit {

    constructor(private router: Router, private appsListService: AppsListService) { }

    ngOnInit() {
        let ruta = this.appsListService.defaultChildRoute('concentrados');
        console.log(ruta);
        if (ruta != '...') {
            this.router.navigate([ruta]);
        }
    }

}
