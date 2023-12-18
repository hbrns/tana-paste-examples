{
	"translatorID": "dda092d2-a257-46af-b9a3-2f04a55cb04f",
	"label": "Tana Metadata Export",
	"creator": "Stian Håklev based on Joel Chan's work",
	"target": "md",
	"minVersion": "2.0",
	"maxVersion": "",
	"priority": 200,
	"inRepository": true,
	"translatorType": 2,
	"lastUpdated": "2023-11-24 10:19:35"
}

	// lookup table that maps [item types](https://api.zotero.org/itemTypes) to labels
	const itemTypeLabels = {
		'artwork': 'Artwork',
		'audioRecording': 'Audio Recording',
		'bill': 'Bill',
		'blogPost': 'Blog Post',
		'book': 'Book',
		'bookSection': 'Book Section',
		'case': 'Case',
		'conferencePaper': 'Conference Paper',
		'dataset': 'Dataset',
		'dictionaryEntry': 'Dictionary Entry',
		'document': 'Document',
		'email': 'E-mail',
		'encyclopediaArticle': 'Encyclopedia Article',
		'film': 'Film',
		'forumPost': 'Forum Post',
		'hearing': 'Hearing',
		'instantMessage': 'Instant Message',
		'interview': 'Interview',
		'journalArticle': 'Journal Article',
		'letter': 'Letter',
		'magazineArticle': 'Magazine Article',
		'manuscript': 'Manuscript',
		'map': 'Map',
		'newspaperArticle': 'Newspaper Article',
		'note': 'Note',
		'patent': 'Patent',
		'podcast': 'Podcast',
		'presentation': 'Presentation',
		'radioBroadcast': 'Radio Broadcast',
		'report': 'Report',
		'computerProgram': 'Software',
		'standard': 'Standard',
		'statute': 'Statute',
		'tvBroadcast': 'TV Broadcast',
		'thesis': 'Thesis',
		'videoRecording': 'Video Recording',
		'webpage': 'Web Page'
	};

  // Define a function that takes an item type and returns its label
  function getItemTypeLabel(itemType) {
	// Check if the item type is valid
	if (itemTypeLabels.hasOwnProperty(itemType)) {
	  // Return the corresponding label
	  return itemTypeLabels[itemType];
	} else {
	  // Return an error message
	  return 'Invalid item type';
	}
  }
  
  function doExport() {
	Zotero.write('%%tana%%\n');
	var item;
	var supertag = "#Document";
	
	while (item = Zotero.nextItem()) {
	  // ref
	  Zotero.write('- ' + item.title);

	  // https://www.zotero.org/support/kb/item_types_and_fields
	  switch(item.itemType) {
		case "book":
		case "bookSection":
		case "preprint":
		  supertag = "#literature";
		  break;
		case 'blogPost':
		case 'conferencePaper':
		case 'encyclopediaArticle':
		case 'journalArticle':
		case 'magazineArticle':
		case 'newspaperArticle':
		case 'preprint':
		case 'report':
		case 'thesis':
		  supertag = "#article";
		  break;
		case 'webpage':
		  supertag = "#website";
		  break;
		case 'podcast':
		case 'radioBroadCast':
		  supertag ="#podcast";
		  break;
		case 'computerProgram':
		  supertag = "#software";
		  break;
		case 'film':
		case 'tvBroadcast':
		case 'videoRecording':
		  supertag = "#video";
		  break;
		case 'note':
		default:
		  supertag = "";
	  }
	  Zotero.write(' ' + supertag + ' \n');

	  // author
	  Zotero.write('  - Author:: \n');
	  // write authors as indented nodes
	  for (author in item.creators){
		var authorName = (item.creators[author].firstName || '') + ' ' + (item.creators[author].lastName || '');
		Zotero.write('    - [[' + authorName.trim() + ']]\n');
	  }
	  //Zotero.write('\n');

	  // year
	  var date = Zotero.Utilities.strToDate(item.date);
	  var dateS = (date.year) ? date.year : item.date;   
	  Zotero.write('  - Year:: ')
	  //Zotero.write((dateS||'') + '\n')
	  Zotero.write(('[[' + dateS + ']] '||'') + '\n')
	  
	  // accessDate
	  Zotero.write('  - Accessed:: ')
	  Zotero.write(('[[' + item.accessDate + ']] '||'') + '\n')

	  // publication
	  Zotero.write('  - Published by:: ')
	  Zotero.write((item.publicationTitle ||'')+ '\n')

	  // rights
	  Zotero.write('  - License:: ')
	  Zotero.write((item.rights ||'')+ '\n')

	  // language
	  if (item.itemType == 'computerProgram') {
		Zotero.write('  - Programming Language:: ')
		Zotero.write((item.programmingLanguage ||'')+ '\n')
		// libraryCatalog
		Zotero.write('  - Listed on:: ')
		Zotero.write((item.libraryCatalog ||'')+ '\n')
	  } else {
		Zotero.write('  - Language:: ')
		Zotero.write((item.language ||'')+ '\n')
      }

	  // type
	  Zotero.write('  - Type (Zotero):: ')
	  //Zotero.write((item.itemType ||'')+ '\n')
	  Zotero.write((getItemTypeLabel(item.itemType) ||'')+ '\n')
	  
	  // zotero link
	  var library_id = item.libraryID ? item.libraryID : 0;  
	  var itemLink = 'zotero://select/items/' + library_id + '_' + item.key;

	  Zotero.write('  - Zotero:: ')
	  Zotero.write('[Zotero Link](' + itemLink + ')\n')
   
	  // url with citation
	  Zotero.write('  - URL:: ' + (item.url||'') + '\n')
	  
	  abstract = item.abstractNote.replace(/^\s*[\r\n]/gm, "")
	  abstract = abstract.replace(/^-/gm, '\t\t-')
	  abstract = abstract.replace(/^/gm, '\t')
	  Zotero.write('  - Abstract:: '+  (abstract || '')+ '\n')
	}
  }
/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/
