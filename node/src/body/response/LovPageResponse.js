var lovPage = (lov, index, total, value) => {
  var returnLov = new Array();
  for(let i = 0; i < value.length; i++) {
    if(lov == 'species') {
      returnLov.push({
        key: value[i].species_id,
        value: value[i].species_value
      })
    }
    if(lov == 'researchArea') {
      returnLov.push({
        key: value[i].research_area_id,
        value: value[i].research_area_value,
        exportValue: value[i].research_area_export,
      })
    }
    if(lov == 'cellSeedingDensity') {
      returnLov.push({
        key: value[i].cell_sd_id,
        value: value[i].cell_sd_value
      })
    }
    if(lov == 'plateCoating') {
      returnLov.push({
        key: value[i].plate_coating_id,
        value: value[i].plate_coating_value
      })
    }
    if(lov == 'cellTypes') {
      returnLov.push({
        key: value[i].cell_types_id,
        value: value[i].cell_types_value
      })
    }
    if(lov == 'cellLine') {
      returnLov.push({
        id: value[i].cell_line_id,
        value: value[i].cell_line_value,
        cellTypes: value[i].cell_types_fk
      })
    }
    if(lov == 'platform') {
      returnLov.push({
        key: value[i].platform_id,
        value: value[i].platform_value,
        exportValue: value[i].platform_export_value,
        business: value[i].platform_business_fk
      })
    }
    if(lov == 'product') {
      returnLov.push({
        id: value[i].product_id,
        value: value[i].product_value,
        exportValue: value[i].product_export_value,
        platform: value[i].platform_fk
      })
    }
    if(lov == 'part') {
      returnLov.push({
        key: value[i].part_id,
        value: value[i].part_value
      })
    }
    if(lov == 'assay') {
      returnLov.push({
        id: value[i].assay_id,
        value: value[i].assay_value,
        exportValue: value[i].assay_export_value,
        business: value[i].assay_business_fk,
        product: value[i].product_fk,
        part: value[i].part_fk
      })
    }
    if(lov == 'assayByBusiness') {
      returnLov.push({
        id: value[i].assay_by_business_id,
        value: value[i].assay_by_business_value,
        exportValue: value[i].assay_by_business_export_value,
        business: value[i].assay_by_business_fk
      })
    }
    if(lov == 'assayPnsByProduct') {
      returnLov.push({
        id: value[i].assay_pns_by_product_id,
        value: value[i].assay_pns_by_product_value,
        product: value[i].assay_pns_by_product_fk,
        part: value[i].assay_pns_by_product_part_fk
      })
    }
    if(lov == 'business') {
      returnLov.push({
        key: value[i].business_id,
        value: value[i].business_value,
      })
    }
  }
  if(lov == 'cellLine' || lov == 'product' || lov == 'assay' || lov == 'assayByBusiness' || lov == 'assayPnsByProduct') {
    var response = {
      index: index,
      total: total[0].total,
      data: returnLov
    }
  }
  if(lov == 'assayByBusiness') {
    var response = {
      index: index,
      total: total[0].total,
      data: returnLov
    }
  }
  if(lov == 'species' || lov == 'researchArea' || lov == 'cellSeedingDensity' || lov == 'plateCoating' || lov == 'cellTypes' || lov == 'platform' || lov == 'part' || lov == 'business') {
    var response = {
      index: index,
      total: total[0].total,
      lov: returnLov
    }
  }
  return response;
};

exports.lovPage = lovPage;