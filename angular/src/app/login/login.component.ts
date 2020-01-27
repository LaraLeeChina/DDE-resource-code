import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Util } from '../../services/util'
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  errMsgLoginFlag: boolean = true;
  errMsg: string = ""
  isAuthenticated: boolean;

  constructor(private router: Router, private util: Util, private activateRoute: ActivatedRoute, private notificationService: NotificationService) {
    activateRoute.queryParams.subscribe(queryParams => {
      if(queryParams.expire == 'login' && localStorage.getItem('expire') == 'login') {
        notificationService.show({
          content: 'You login session is expired, please login again.',
          cssClass: 'button-notification',
          animation: { type: 'slide', duration: 500 },
          position: { horizontal: 'center', vertical: 'bottom' },
          type: { style: 'warning', icon: true },
          hideAfter: 3000//自动消失时间
        });
        localStorage.removeItem('expire')
      }
    })
    var login = localStorage.getItem('login');
    var accessToken = localStorage.getItem('accessToken');
    if(login && accessToken) {
      this.router.navigate(['/home'])
    }
  }

  async ngOnInit() {
    var loginError = localStorage.getItem('loginError');
    if(loginError) {
      this.errMsgLoginFlag = false
      this.errMsg = loginError
    } else {
      this.errMsgLoginFlag = true
      this.errMsg = ""
    }
  }

  login() {
    var codeVerifier = this.util.generateCodeVerifier()
    localStorage.setItem('codeVerifier', codeVerifier)
    this.errMsgLoginFlag = true
    this.errMsg = ""
    const oktaAuthorizeUrl = environment.oktaUrl + '/oauth2/default/v1/authorize' 
    const clientId = environment.clientId
    const redirectUri = environment.redirectUrl
    const codeChallenge = this.util.generateCodeChallenge(codeVerifier)
    const state = this.util.generateState()
    const codeChallengeMethod = 'S256'
    const scope = 'openid'
    window.location.href = oktaAuthorizeUrl + '?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&response_type=code&code_challenge=' + codeChallenge + '&state=' + state + '&code_challenge_method=' + codeChallengeMethod + '&scope=' + scope
  }

  ngOnDestroy() {
    this.errMsgLoginFlag = true
    this.errMsg = ""
  }

}
