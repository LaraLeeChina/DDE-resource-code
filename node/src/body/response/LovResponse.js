var lov = (lov, value) => {
  var response = [];
  for(let i = 0; i < value.length; i++) {
    if(lov == 'species') {
      response.push({
        key: value[i].species_id,
        value: value[i].species_value
      })
    }
    if(lov == 'researchArea') {
      response.push({
        key: value[i].research_area_id,
        value: value[i].research_area_value
      })
    }
    if(lov == 'cellSeedingDensity') {
      response.push({
        key: value[i].cell_sd_id,
        value: value[i].cell_sd_value
      })
    }
    if(lov == 'plateCoating') {
      response.push({
        key: value[i].plate_coating_id,
        value: value[i].plate_coating_value
      })
    }
    if(lov == 'cellTypes') {
      response.push({
        key: value[i].cell_types_id,
        value: value[i].cell_types_value
      })
    }
    if(lov == 'cellLine') {
      response.push({
        key: i + 1,
        value: value[i].cell_line_value
      })
    }
    if(lov == 'platform') {
      response.push({
        key: i + 1,
        value: value[i].platform_value
      })
    }
    if(lov == 'product') {
      response.push({
        key: i + 1,
        value: value[i].product_value
      })
    }
    if(lov == 'part') {
      response.push({
        key: value[i].part_id,
        value: value[i].part_value
      })
    }
    if(lov == 'assay') {
      response.push({
        key: value[i].id,
        value: value[i].assay_pns_by_product_value
      })
    }
    if(lov == 'assayForPnsProduct') {
      response.push({
        key: i + 1,
        value: value[i].assay_by_business_value
      })
    }
    if(lov == 'business') {
      response.push({
        key: value[i].business_id,
        value: value[i].business_value
      })
    }
  }
  return response;
};

exports.lov = lov;