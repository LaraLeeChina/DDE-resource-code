var util = require("./../../util/util")

var publication = (index, total, publication) => {
  var parsePublication = []
  for(let i = 0; i < publication.length; i++) {
    parsePublication.push({
      "ID": publication[i].id,
      "Publication Link": publication[i].publication_link,
      "Publication Title": publication[i].publication_title,
      "Publication Date": util.formatDateUSA(new Date(publication[i].publication_date)),
      "Primary Author": publication[i].primary_author,
      "Author(s)": publication[i].authors,
      "Journal Name": publication[i].journal_name,
      "SubId": publication[i].sub_id,
      "Research Area": publication[i].research_area,
      "Cell Line": publication[i].cell_line,
      "Cell Types": publication[i].cell_type,
      "Species": publication[i].species,
      "Platform": publication[i].platform,
      "Product": publication[i].product,
      "Assay": publication[i].assay,
      "Cell Seeding Density": publication[i].cell_seeding_density,
      "Plate Coating": publication[i].plate_coating,
      "Part": publication[i].part,
      "Create/Update Date": util.formatCuDateUSA(new Date(publication[i].cu_date))
    })
  }
  var response
  if(!index && !total) {
    response = parsePublication
  } else {
    response = {
      index: index,
      total: total[0].total,
      publication: parsePublication
    };
  }
  return response;
};

exports.publication = publication;