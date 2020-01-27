import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RootService } from './rootService';
import { environment } from './../environments/environment';

@Injectable()
export class Service {
    apiBase: string = environment.apiBase;
    constructor(private rootService: RootService) { }

    /**
     * 登录
     * @param username 用户名
     * @param password 密码
     */
    public login(): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + "/login",
        });
    }

    /**
     * 退出
     * @param idToken idToken
     */
    public logout(idToken): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + "/logout",
            data: {
                idToken
            }
        });
    }

    /**
     * 主页数据查询
     * @param index 当前页码，1开始
     * @param offset 每页条数
     */
    public publicAtion(data: object): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/publication",
            data: data
        });
    }

    /**
     * 新增
     * @param data 数据项
     */
    public addPublicAtion(data: object): Promise<any> {
        return this.rootService.request({
            method: "POST",
            url: this.apiBase + "/publication",
            data
        });
    }

    /**
     * 主页数据修改
     * @param id 当前数据的id
     * @param data 修改的某一项数据
     */
    public publicationEdit(id: string, data: object): Promise<any> {
        return this.rootService.request({
            method: "PUT",
            url: this.apiBase + "/publication/edit/" + id,
            data: data
        });
    }

    /**
     * insert的save
     * @param data 修改的某一项数据
     */
    public insertPublication(data: object): Promise<any> {
        return this.rootService.request({
            method: "PUT",
            url: this.apiBase + "/publication",
            data: data
        });
    }

    /**
 * Cell Type 下拉查询
 * @param cellLines
 */
    public cellLines(cellLine: string): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/cellLine",
            data: {
                cellLine
            }
        });
    }

    /**
     * Cell Type 下拉查询
     * @param cellLine
     */
    public cellTypes(cellLine: string): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/cellTypes",
            data: {
                cellLine
            }
        });
    }

    /**
     * researcharea下拉查询
     */
    public researcharea(): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/researcharea"
        });
    }

    /**
     * cellseedingdensity下拉查询
     */
    public cellseedingdensity(): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/cellseedingdensity"
        });
    }

    /**
     * platecoating下拉查询
     */
    public platecoating(): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/platecoating"
        });
    }

    /**
     * journalname下拉查询
     */
    public journalname(): Promise<any> {
        return this.rootService.request({
            method: "GET",
            url: this.apiBase + "/journalname"
        });
    }

    /**
     * import文件
     * @param file 文件
     */
    public publicationImport(data: FormData): Promise<any> {
        return this.rootService.request({
            method: "POST",
            url: this.apiBase + "/publication/import",
            data
        });
    }

    /**
     * 删除Publication
     * @param data 
     * 如果此条数据只有Base的信息{"id": 20}
     * 有附表的数据{"id": 20,"subId": 3}
     */
    public deletePublication(data: object): Promise<any> {
        return this.rootService.request({
            method: "DELETE",
            url: this.apiBase + "/publication",
            data
        });
    }

    /**
     * Species下拉查询
     */
    public species(): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/species'
        });
    }

    /**
     * Edit 查询接口
     * @param id 查询接口返回的Id字段值
     * @param index 为当前页，从1开始
     * @param offset为每页多少条数据
     */
    public queryPublicationByID(id: string, index: number, offset: number): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/publication/getedit',
            data: {
                id,
                index,
                offset
            }
        });
    }

    /**
     * species分页查询
     * @param index 页码
     * @param offset 分页数
     */
    public speciesPage(index: number, offset: number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/species/page',
            data: {
                index,
                offset,
                value
            }
        });
    }

    /**
     * species更新
     * @param key 
     * @param value 
     */
    public modifyspecies(key: string | number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/species',
            data: {
                key,
                value
            }
        });
    }

    /**
     * 新增species
     * @param value 
     * @param exportValue 
     */
    public addspecies(value: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/species',
            data: {
                value               
            }
        });
    }

    /**
     * 删除species
     * @param key key 
     */
    public removeSpecies(key: string | number): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/species',
            data: {
                key
            }
        });
    }

    /**
     * researcharea分页查询
     * @param index 页码
     * @param offset 分页数
     */
    public researchareaPage(index: number, offset: number, value: string, exportValue: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/researcharea/page',
            data: {
                index,
                offset,
                value,
                exportValue
            }
        });
    }

    /**
     * 修改researcharea
     * @param key 
     * @param value 
     * @param exportValue 
     */
    public modifyResearcharea(key: string | number, value: string, exportValue: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/researcharea',
            data: {
                key,
                value,
                exportValue
            }
        });
    }


    /**
     * 新增researcharea
     * @param value 
     * @param exportValue 
     */
    public addResearcharea(value: string, exportValue: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/researcharea',
            data: {
                value,
                exportValue
            }
        });
    }

    /**
     * 删除researcharea
     * @param key 
     */
    public removeResearcharea(key: string | number): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/researcharea',
            data: {
                key
            }
        });
    }

    /**
     * cellseedingdensity分页查询
     * @param index 
     * @param offset 
     */
    public cellseedingdensityPage(index: number, offset: number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/cellseedingdensity/page',
            data: {
                index,
                offset,
                value
            }
        });
    }

    /**
     * 更新cellseedingdensity
     * @param key 
     * @param value 
     */
    public modifyCellseedingdensity(key: string | number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/cellseedingdensity',
            data: {
                key,
                value
            }
        });
    }

    /**
     * 新增cellseedingdensity
     * @param value 
     */
    public addCellseedingdensity(value: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/cellseedingdensity',
            data: {
                value
            }
        });
    }

    /**
     *删除cellseedingdensity
     * @param key 
     */
    public removeCellseedingdensity(key: string | number): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/cellseedingdensity',
            data: {
                key
            }
        });
    }

    /**
     * platecoating分页查询
     * @param index 
     * @param offset 
     */
    public platecoatingPage(index: number, offset: number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/platecoating/page',
            data: {
                index,
                offset,
                value
            }
        });
    }

    /**
     * 修改platecoating
     */
    public modifyPlatecoating(key: string | number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/platecoating',
            data: {
                key,
                value
            }
        });
    }

    /**
     * 新增platecoating
     */
    public addPlatecoating(value: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/platecoating',
            data: {
                value
            }
        });
    }

    /**
     * 删除platecoating
     * @param key 
     */
    public removePlatecoating(key: string | number): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/platecoating',
            data: {
                key
            }
        });
    }

    /**
     * journalname分页查询
     * @param index 
     * @param offset 
     */
    public journalnamePage(index: number, offset: number): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/journalname/page',
            data: {
                index,
                offset
            }
        });
    }

    /**
     * 修改journalname
     * @param key 
     * @param value 
     */
    public modifyJournalname(key: string | number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/journalname',
            data: {
                key,
                value
            }
        });
    }

    /**
     * 新增journalname
     * @param value 
     */
    public addJournalname(value: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/journalname',
            data: {
                value
            }
        });
    }

    /**
     * 删除journalname
     * @param value 
     */
    public removeJournalname(key: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/journalname',
            data: {
                key
            }
        });
    }

    /**
     * cellType分页查询
     * @param index
     * @param offest
     */
    public celltypesPage(index: number, offset: number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/celltypes/page',
            data: {
                index,
                offset,
                value
            }
        });
    }

    /**
     * 更新celltypes
     * @param key 
     * @param value 
     */
    public modifyCelltypes(key: string | number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/celltypes',
            data: {
                key,
                value
            }
        });
    }

    /**
     * 新增celltypes
     * @param value 
     */
    public addCelltypes(value: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/celltypes',
            data: {
                value
            }
        });
    }

    /**
     * 删除celltypes
     * @param value 
     */
    public removeCelltypes(key: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/celltypes',
            data: {
                key
            }
        });
    }

    /**
     * cellline分页查询
     * @param index 
     * @param offset 
     */
    public celllinePage(index: number, offset: number, value: string, cellTypes: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/cellline/page',
            data: {
                index,
                offset,
                value,
                cellTypes
            }
        });
    }

    /**
     * 更新celltypes
     * @param key 
     * @param value 
     */
    public modifyCellline(id: string, value: string, cellTypes: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/cellline',
            data: {
                id,
                value,
                cellTypes
            }
        });
    }

    /**
 * 新增celltypes
 * @param value 
 */
    public addCellline(value: string, cellTypes: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/cellline',
            data: {
                value,
                cellTypes
            }
        });
    }

    /**
     * 删除celltypes
     * @param id 
     */
    public removeCellline(id: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/cellline',
            data: {
                id
            }
        });
    }

    /**
     * 删除subid
     * @param id 
     * @param subId 
     */
    public removeSubPublication(id: string | number, subId: string | number): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/publication/sub',
            data: {
                id,
                subId
            }
        });
    }

    /**
     * 获取platform
     * @param product 
     * @param assay 
     * @param part 
     */
    public getPlatform(product?: string, assay?: string, part?: string) : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/platform',
            data: {
                product,
                assay,
                part
            }
        });
    }

    /**
    * platform分页查询
    * @param index 
    * @param offset 
    */
    public platformPage(index: number, offset: number, value: string, exportValue: string, business: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/platform/page',
            data: {
                index,
                offset,
                value,
                exportValue,
                business
            }
        });
    }

    /**
     * 更新platform
     * @param key 
     * @param value 
     */
    public modifyPlatform(key: string, value: string, exportValue: string, business: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/platform',
            data: {
                key,
                value,
                exportValue,
                business
            }
        });
    }

    /**
    * 新增platform
    * @param value 
    */
    public addPlatform(value: string, exportValue: string, business: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/platform',
            data: {
                value,
                exportValue,
                business
            }
        });
    }

    /**
     * 删除celltypes
     * @param id 
     */
    public removePlatform(key: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/platform',
            data: {
                key
            }
        });
    }

    /**
     * 查询assay
     * @param platform 
     * @param product 
     * @param part 
     */
    public getAssay(product?: string) : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/assay',
            data: {
                product
            }
        });
    }

    /**
     * 查询assay for pns product
     */
    public getAssayForPnsProduct() : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/assayForPnsProduct'
        });
    }

    /**
     * 
     * @param index 
     * @param offset 
     * @param value 
     * @param exportValue 
     * @param business 
     */
    public assayPageByBusiness(index: number, offset: number, value: string, exportValue: string, business: string) : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/assayByBusiness/page',
            data: {
                index,
                offset,
                value,
                exportValue,
                business
            }
        })
    }

    /**
     * 
     * @param index 
     * @param offset 
     * @param value 
     * @param product 
     * @param part
     */
    public assayPagePnsByProduct(index: number, offset: number, value: string, product: string, part: string) : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/assayPnsByProduct/page',
            data: {
                index,
                offset,
                value,
                product,
                part
            }
        })
    }

    /**
     * 更新assay by business
     * @param id 
     * @param value 
     * @param exportValue 
     * @param business 
     */
    public modifyAssayByBusiness(id: string, value: string, exportValue: string, business: string) : Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/assayByBusiness',
            data: {
                id,
                value,
                exportValue,
                business
            }
        });
    }

        /**
     * 更新assay pns by product
     * @param id 
     * @param value 
     * @param exportValue 
     * @param business 
     */
    public modifyAssayPnsByProduct(id: string, value: string, product: string, part: string) : Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/assayPnsByProduct',
            data: {
                id,
                value,
                product,
                part
            }
        });
    }

    /**
     * 新增assay
     * @param value 
     * @param exportValue 
     * @param business 
     */
    public addAssayByBusiness(value: string, exportValue: string, business: string) : Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/assayByBusiness',
            data: {
                value,
                exportValue,
                business
            }
        });
    }

    /**
     * 新增assay
     * @param value 
     * @param exportValue 
     * @param business 
     */
    public addAssayPnsByProduct(value: string, product: string, part: string) : Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/assayPnsByProduct',
            data: {
                value,
                product,
                part
            }
        });
    }

    /**
     * 
     * @param id 删除assay by business
     */
    public removeAssayByBusiness(id: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/assayByBusiness',
            data: {
                id
            }
        })
    }

        /**
     * 
     * @param id 删除assay pns by product
     */
    public removeAssayPnsByProduct(id: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/assayPnsByProduct',
            data: {
                id
            }
        })
    }

    /**
     * 获取Product
     * @param platform 
     * @param assay 
     * @param part 
     */
    public getProduct(platform?: string,assay?: string, part?: string) : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/product',
            data: {
                platform,
                assay,
                part
            }
        });
    }

    public getProductAll() : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/product',
            data: {
                action: 'all'
            }
        });
    }

    public getProductByBusiness(business: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/product/business',
            data: {
                business: business
            }
        });
    }

    public getPartAll() : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/part',
            data: {
                product: 'all',
                assay: 'all'
            }
        });
    }
    

    /**
     * product分页查询
     * @param index 
     * @param offset 
     */
    public productPage(index: number, offset: number, value: string, exportValue: string, platform: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/product/page',
            data: {
                index,
                offset,
                value,
                exportValue,
                platform
            }
        });
    }

    /**
     * product更新
     * @param id 
     * @param value 
     * @param exportValue 
     * @param platform 
     */
    public modifyProduct(id: string,value: string,exportValue: string,platform: string) : Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/product',
            data: {
                id,
                value,
                exportValue,
                platform
            }
        });
    }

    /**
     * 新增product
     * @param value 
     * @param exportValue 
     * @param platform 
     */
    public addProduct(value: string, exportValue: string, platform: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/product',
            data: {
                value,
                exportValue,
                platform
            }
        });
    }

    /**
     * 删除Product
     * @param id 
     */
    public removeProduct(id: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/product',
            data: {
                id
            }
        });
    }

    /**
     * 获取Part
     * @param platform 
     * @param assay 
     * @param product 
     */
    public getPart(assay?: string, product?: string) : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/part',
            data: {
                assay,
                product
            }
        });
    }

    /**
     * part分页查询
     * @param index 
     * @param offset 
     */
    public partPage(index: number, offset: number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/part/page',
            data: {
                index,
                offset,
                value
            }
        });
    }

    /**
     * 更新part
     * @param key 
     * @param value 
     */
    public modifyPart(key: string, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/part',
            data: {
                key,
                value               
            }
        });
    }

    /**
     * 新增Part
     * @param value 
     */
    public addPart(value: string) : Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/part',
            data: {
                value
            }
        });
    }

    /**
     * 删除Product
     * @param id 
     */
    public removePart(key: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/part',
            data: {
                key
            }
        });
    }

    /**
     * 获取Business
     * 
     */
    public getBusiness() : Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/business'
        });
    }

    /**
     * Business分页查询
     * @param index 
     * @param offset 
     */
    public businessPage(index: number, offset: number, value: string): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/business/page',
            data: {
                index,
                offset,
                value
            }
        });
    }

    /**
     * 更新Business
     * @param key
     * @param value 
     */
    public modifyBusiness(key: string, value: string): Promise<any> {
        return this.rootService.request({
            method: 'PUT',
            url: this.apiBase + '/business',
            data: {
                key,
                value               
            }
        });
    }

    /**
     * 新增Business
     * @param value 
     */
    public addBusiness(value: string): Promise<any> {
        return this.rootService.request({
            method: 'POST',
            url: this.apiBase + '/business',
            data: {
                value               
            }
        });
    }

    /**
     * 删除Business
     * @param key 
     */
    public removeBusiness(key: string): Promise<any> {
        return this.rootService.request({
            method: 'DELETE',
            url: this.apiBase + '/business',
            data: {
                key               
            }
        });
    }

    /**
     * 导出
     * @param data id
     */
    public export(data: Array<{ id: string | number, subId?: string | number }>): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/publication/export',
            data: data
        });
    }

    /**
     * 导出For Endeca
     * @param data id
     */
    public exportForEndeca(): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/publication/export/endeca'
        });
    }

    /**
     * push to Endeca
     * @param data id
     */
    public pushToEndeca(): Promise<any> {
        return this.rootService.request({
            method: 'GET',
            url: this.apiBase + '/publication/export/endeca/push'
        });
    }
}
