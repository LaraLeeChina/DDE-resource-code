import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions }   from '@angular/http';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';
import { NotificationService } from '@progress/kendo-angular-notification';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RootService {

    constructor(private http: Http, private requestOptions: RequestOptions, private router: Router, private notificationService: NotificationService) {}
    private apiBase: string = environment.apiBase;
    //配置需要将'Content-Type'设置为'multipart/form-data'的请求
    private Urls: string[] = [this.apiBase+"/publication/import"];

    /**
   * 统一发送请求
   * @param params
   * @returns {Promise<{success: boolean, msg: string}>|Promise<R>}
   */
    public request(params: any): any {

        let method = params['method'].toLocaleLowerCase();
        
        return this[method](params['url'], params['data']);               
    }

    /**
   * get请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */
    public get(url: string, params: any): any {
        if (url.indexOf("publication/export") != -1 || url.indexOf("publication/export/endeca") != -1) {
            return this.http.get(url, { headers: this.createHeaders(url), search: params,responseType: 2 })
                .toPromise()
                .then(this.handleSuccess)
                .catch(res => this.handleError(res));
        } else {
            return this.http.get(url, { headers: this.createHeaders(url), search: params })
                .toPromise()
                .then(this.handleSuccess)
                .catch(res => this.handleError(res));
        }
    }
 
  /**
   * post请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */
    public post(url: string, params: any): any  {
        return this.http.post(url, params,{ headers: this.createHeaders(url) })
        .toPromise()
        .then(this.handleSuccess)
        .catch(res => this.handleError(res));
    }

    /**
   * put请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */
    public put(url: string, params: any): any  {
        return this.http.put(url, params,{ headers: this.createHeaders() })
        .toPromise()
        .then(this.handleSuccess)
        .catch(res => this.handleError(res));
    }

     /**
   * delete请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */
    public delete(url: string, params: any): any  {
        return this.http.delete(url, { headers: this.createHeaders(), search: params })
        .toPromise()
        .then(this.handleSuccess)
        .catch(res => this.handleError(res));
    }

    /**
     * 创建Headers
     * @param url 接口地址
     */
    private createHeaders(url?: string): Headers {
        const headers: Headers = new Headers(),
              accessToken = localStorage.getItem("accessToken");
              if(this.Urls.indexOf(url) == -1){
                headers.append('Content-Type', 'application/json');
              }
              if(url && url.indexOf("publication/export") != -1){
                headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              }          
              headers.append('Authorization', "Bearer " + accessToken);
              headers.append('Cache-Control', 'no-cache');
              headers.append('Pragma', 'no-cache');
              headers.append('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
        return headers;
    }

    /**
   * 处理请求成功
   * @param res
   * @returns {{data: (string|null|((node:any)=>any)
   */
    private handleSuccess(res: Response) {
                
        try {
          return {
                data: res.json(), // 返回内容                            
                statusText: res.statusText,
                status: res.status,
                success: true
            } 
        } catch (error) {
            return {
                data: res, // 返回内容                            
                statusText: res.statusText,
                status: res.status,
                success: true
            }
        }
    }

    /**
   * 处理请求错误
   * @param error
   * @returns {void|Promise<string>|Promise<T>|any}
   */
    private handleError(error) {
        let msg = '请求失败';
        if (error.status == 401) {
            localStorage.removeItem('login');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('idToken')
            localStorage.setItem('expire', 'login')
            this.router.navigate([''], { queryParams: { expire: 'login' } });
        }
        console.error(error);
        return {
                data: error.json(), // 返回内容                            
                statusText: error.statusText,
                status: error.status,
                success: false
            }
    }

}