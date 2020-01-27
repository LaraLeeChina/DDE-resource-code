import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetTableInformService {

  constructor() {

  }

  getTableColumnName(){

  }

}

export const  tableSourceInform = [
  {
  ABSTRACT: "Immunoglobulin E (IgE)-mediated mast cell activation is involved...",
  ASSAY: "Cell Mitochondrial Stress Test",
  AUTHORS: "Yama A. Abassi~Jo Ann Jackson~Jenny Zhu~James O’Connell~XiaoboWa...",
  CELLLINE: "T-cells",
  CELLSEEDINGDENSITY: "4.0x10^6 cells/well",
  CELLTYPES: "T-cells",
  CONCENTRATION: "Not Specified",
  ID: 1,
  ISOLATIONMETHOD: "Not Specified",
  JOURNALNAME: "Journal of Immunological Methods",
  LANGUAGE: "English",
  MEDIUM: "Not Specified",
  NORMALIZATIONMETHODS: null,
  PART: "102959-100",
  PLATECOATING: "Cell Tak",
  PRODUCT: null,
  PUBLICATIONDATE: "2004/7/2",
  PUBLICATIONLINK: "http://www.ncbi.nlm.nih.gov/pubmed/15350524",
  PUBLICATIONTITLE: "Label-free, real-time monitoring of IgE-mediated mast cell activ...",
  RESEARCHAREA: "Neurobiology Research~Immunology Research",
  SPECIES: "Mouse"
},
  {
    ABSTRACT: "Immunoglobulin E (IgE)-mediated mast cell activation is involved...",
    ASSAY: "Cell Mitochondrial Stress Test",
    AUTHORS: "Yama A. Abassi~Jo Ann Jackson~Jenny Zhu~James O’Connell~XiaoboWa...",
    CELLLINE: "T-cells",
    CELLSEEDINGDENSITY: "4.0x10^6 cells/well",
    CELLTYPES: "T-cells",
    CONCENTRATION: "Not Specified",
    ID: 2,
    ISOLATIONMETHOD: "Not Specified",
    JOURNALNAME: "Journal of Immunological Methods",
    LANGUAGE: "English",
    MEDIUM: "Not Specified",
    NORMALIZATIONMETHODS: null,
    PART: "102959-100",
    PLATECOATING: "Cell Tak",
    PRODUCT: null,
    PUBLICATIONDATE: "2004/7/2",
    PUBLICATIONLINK: "http://www.ncbi.nlm.nih.gov/pubmed/15350524",
    PUBLICATIONTITLE: "Label-free, real-time monitoring of IgE-mediated mast cell activ...",
    RESEARCHAREA: "Neurobiology Research~Immunology Research",
    SPECIES: "Mouse"
  }]

export class Product {
  public ID: number;
  public AUTHORS = '';
  public ISOLATIONMETHOD = false;
  public PUBLICATIONDATE: number;
  public PUBLICATIONLINK = 0;
}
