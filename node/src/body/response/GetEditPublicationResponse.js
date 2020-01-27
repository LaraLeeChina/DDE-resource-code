var util = require("../../util/util")

var getEditPublication = (index, subTotal, basePublication, subPublication) => {
  var parseSubPublication = [];
  for(let i = 0; i < subPublication.length; i++) {
    parseSubPublication.push({
      "SubId": subPublication[i].sub_id,
      "Research Area": subPublication[i].research_area,
      "Cell Line": subPublication[i].cell_line,
      "Cell Type": subPublication[i].cell_type,
      "Species": subPublication[i].species,
      "Platform": subPublication[i].platform,
      "Product": subPublication[i].product,
      "Assay": subPublication[i].assay,
      "Cell Seeding Density": subPublication[i].cell_seeding_density,
      "Plate Coating": subPublication[i].plate_coating,
      "Part": subPublication[i].part
    })
  }
  var response = {
    "ID": basePublication[0].id,
    "Publication Link": basePublication[0].publication_link,
    "Publication Title": basePublication[0].publication_title,
    "Publication Date": util.formatDateUSA(new Date(basePublication[0].publication_date)),
    "Primary Author": basePublication[0].primary_author,
    "Author(s)": basePublication[0].authors,
    "Journal Name": basePublication[0].journal_name,
    SubPublication: {
      index: index,
      total: subTotal[0].total,
      data: parseSubPublication
    }
  };
  return response;
};

exports.getEditPublication = getEditPublication;