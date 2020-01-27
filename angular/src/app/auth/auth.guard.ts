import { Injectable } from '@angular/core';
import { CanActivate , Router, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let loginFlag: boolean = Boolean(localStorage.getItem("accessToken"));      
      if (!loginFlag) {
        this.router.navigate(['']);
      }
    return loginFlag;
  }

}
