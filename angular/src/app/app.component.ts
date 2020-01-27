import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isAuthenticated: boolean;
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        var login = localStorage.getItem('login')
        if(login) {
          this.isAuthenticated = true
        } else {
          this.isAuthenticated = false
        }
      } 
    });
  }

  ngOnInit() {

  }

  logout() {
    const oktaUrlLogout = environment.oktaUrl + '/oauth2/default/v1/logout'
    const logoutRedirectUri = environment.logoutRedirectUri
    var idToken = localStorage.getItem('idToken')
    window.location.href = oktaUrlLogout + '?id_token_hint=' + idToken + '&post_logout_redirect_uri=' + logoutRedirectUri
  }

}
