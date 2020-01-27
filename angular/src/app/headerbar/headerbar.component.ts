import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from "./../../services/service";

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css'],
  providers: [Service]
})
export class HeaderbarComponent implements OnInit {

  constructor(private Service: Service,private router: Router) { }

  @Input()
  isAuthenticated: boolean;

  @Output() 
  onLogout = new EventEmitter();

  logout() {
    this.onLogout.emit();
  }

  ngOnInit() {
    
  }

}
