import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Service } from "./../../services/service";

@Component({
  selector: 'app-okta-callback',
  templateUrl: './okta-callback.component.html',
  styleUrls: ['./okta-callback.component.css']
})
export class OktaCallbackComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private Service: Service, ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const oktaTokenUrl = environment.oktaUrl + '/oauth2/default/v1/token' 
      const clientId = environment.clientId
      const redirectUri = environment.redirectUrl
      const codeVerifier = localStorage.getItem('codeVerifier')
      if(!params.error && params.code) {
        this.http.post(oktaTokenUrl + '?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&code=' + params.code + '&grant_type=authorization_code&code_verifier=' + codeVerifier, {}, { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).subscribe(res => {
          localStorage.setItem('accessToken', res['access_token'])
          localStorage.setItem('idToken', res['id_token'])
          this.Service.login().then((login) => {
            if(login.data.login == 'login successful') {
              localStorage.setItem('login', 'logined')
              localStorage.removeItem('loginError')
              this.router.navigate(['/home'])
            } else {
              localStorage.removeItem('login')
              localStorage.removeItem('accessToken')
              localStorage.removeItem('idToken')
              localStorage.setItem('loginError', login.data.message)
              this.router.navigate(['/'])
            }
          }) 
        }, error => {
          localStorage.removeItem('login')
          localStorage.setItem('loginError', error.error.error_description)
          this.router.navigate(['/'])
        })
      } else {
        localStorage.removeItem('login')
        localStorage.setItem('loginError', params.error_description)
        this.router.navigate(['/'])
      }
    })
  }

}
