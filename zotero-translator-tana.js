{
	"translatorID": "dda092d2-a257-46af-b9a3-2f04a55cb04f",
	"label": "Tana Paste",
	"creator": "Holger Behrens based on Stian Håklev and Joel Chan's work",
	"target": "md",
	"minVersion": "2.0",
	"maxVersion": "",
	"priority": 200,
	"inRepository": true,
	"translatorType": 2,
	"lastUpdated": "2024-01-21 21:10:00"
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
		switch (item.itemType) {
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
				supertag = "#podcast";
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
		for (author in item.creators) {
			var authorName = (item.creators[author].firstName || '') + ' ' + (item.creators[author].lastName || '');
			Zotero.write('    - ' + authorName.trim() + '\n');
		}

		// year
		var date = Zotero.Utilities.strToDate(item.date);
		var dateS = (date.year) ? date.year : item.date;
		Zotero.write('  - Year:: ')
		Zotero.write(('[[' + dateS + ']] ' || '') + '\n')

		// accessDate
		if (item.accessDate) {
			Zotero.write('  - Accessed:: ')
			Zotero.write(('[[' + item.accessDate + ']] ' || '') + '\n')
		}

		// publication
		Zotero.write('  - Published by:: ')
		Zotero.write((item.publicationTitle || '') + '\n')

		// rights
		Zotero.write('  - License:: ')
		Zotero.write((item.rights || '') + '\n')

		// language
		if (item.itemType == 'computerProgram') {
			Zotero.write('  - Programming Language:: ')
			Zotero.write((item.programmingLanguage || '') + '\n')
			// libraryCatalog
			Zotero.write('  - Listed on:: ')
			Zotero.write((item.libraryCatalog || '') + '\n')
		} else {
			Zotero.write('  - Language:: ')
			Zotero.write((item.language || '') + '\n')
		}

		// type
		Zotero.write('  - Type (Zotero):: ')
		Zotero.write((getItemTypeLabel(item.itemType) || '') + '\n')

		// zotero link
		var library_id = item.libraryID ? item.libraryID : 0;
		var itemLink = 'zotero://select/items/' + library_id + '_' + item.key;

		Zotero.write('  - Zotero:: ')
		Zotero.write('[Zotero Link](' + itemLink + ')\n')

		// url with citation
		Zotero.write('  - URL:: ' + (item.url || '') + '\n')

		// abstract
		abstract = item.abstractNote.replace(/^\s*[\r\n]/gm, "")
		abstract = abstract.replace(/^-/gm, '\t\t-')
		abstract = abstract.replace(/^/gm, '\t')
		Zotero.write('  - Abstract:: ' + (abstract || '') + '\n')

		// notes
		if (item.notes && item.notes.length > 0) {
			let doc = new DOMParser().parseFromString('<div class="zotero-notes"/>', 'text/html');
			let container = doc.body.firstChild;
			let div = doc.createElement('div');
			div.className = 'zotero-note';
			Zotero.write('  - Notes::\n');
			for (let i in item.notes) {
				div.innerHTML += item.notes[i].note || '';
			}
			// Zotero.write('  - Debug Data:: Raw Notes [' + i + '] >>>> ' + div.innerHTML + ' <<<<\n');

			let divs = div.querySelectorAll('div[data-schema-version="8"]');
			divs.forEach(inner => {
				let title = inner.querySelector('h1') ? inner.querySelector('h1').innerHTML.replace(/<br\>/g, ' ') : inner.querySelector('p').innerText;
				Zotero.write('    - ' + title + '\n');
				let highlights = Array.from(inner.querySelectorAll('.highlight')).map(e => e.innerText);
				let citations = Array.from(inner.querySelectorAll('.citation')).map(e => e.innerText);
				for (let i = 0; i < Math.max(highlights.length, citations.length); i++) {
					let highlight = highlights[i] || '';
					let citation = citations[i] || '';
					Zotero.write('      - ' + highlight + ' ' + citation + '\n');
				}
				let paragraphs = Array.from(inner.querySelectorAll('p')).filter(p => !p.querySelector('.highlight') && !p.querySelector('.citation')).map(e => e.innerText);
				if (!inner.querySelector('h1')) { // If the first paragraph was used as the title, remove it from the paragraphs array
					paragraphs.shift();
				}
				paragraphs.forEach((paragraph, i) => {
					// Zotero.write(`    >>> Paragraph ${i+1}: ${paragraph} <<<\n`);
					Zotero.write('      - ' + paragraph + '\n');
				});
			});
		}
	}
}
/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/
