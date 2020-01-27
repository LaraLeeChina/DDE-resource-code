import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-okta-callback-logout',
  templateUrl: './okta-callback-logout.component.html',
  styleUrls: ['./okta-callback-logout.component.css']
})
export class OktaCallbackLogoutComponent implements OnInit {

  constructor(private router: Router) { 
    localStorage.removeItem('login')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    router.navigate(['/'])
  }

  ngOnInit() {
  }

}
