// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require handlebars
//= require_tree ./templates
//= require_tree .

var previewListView;
var noteView;
var previewTemplate;
var noteTemplate;
var newNoteTemplate;
var editNoteTemplate;

$(function() {

	// INITIALIZER
	getAllNotes(); // We need to call this function when the page loads so our data loads in

	// CONTAINERS
	previewListView = $('#preview-list-view');
	noteView = $('#note-view');

	// TEMPLATES
	previewTemplate = HandlebarsTemplates["preview"];
	noteTemplate = HandlebarsTemplates["note"];
	newNoteTemplate = HandlebarsTemplates["newnote"];
	editNoteTemplate = HandlebarsTemplates["editnote"];

	// EVENTS
	$('body').on('click', '.note', getNote);
	$('body').on('click', '.new', renderNewNoteTemplate);
	$('body').on('click', '.create', postNote);
	$('body').on('click', '.edit', getNoteForEdit);
	$('body').on('click', '.update', putNote);
	$('body').on('click', '.delete', deleteNote);

	// AJAX FUNCTIONS
	function getAllNotes() {
		$.get('/notes').done(renderNotePreviews); // gets all the notes and renders the previews
	};

	function getNote() {
		var id = $(this).attr('data-id');
		$.get('/notes/' + id).done(renderNote); // gets a single note, and renders a single note
	};

	function getNoteForEdit() {
		var id = $(this).parent().attr('data-id');
		$.get('/notes/' + id).done(renderEditNoteTemplate); // gets a single notem and renders the edit form
	};

	function postNote() {
		var title = $(this).siblings().find('input').val();
		var content = $(this).siblings().find('textarea').val();
		$.ajax({
			type: 'POST', // ajax post request
			url: '/notes', // to the POST /notes route
			data: { note: { title: title, content: content} }, // note_params in the controller is expecting this format
			success: function(newNote) {
				renderNote(newNote); // renders the single note view with the new note created
				getAllNotes(); // updates the preview note views
			}
		});
	};

	function putNote() {
		var title = $(this).siblings().find('input').val();
		var content = $(this).siblings().find('textarea').val();
		var id = $(this).siblings('h4').find('.id').text();
		$.ajax({
			type: 'PUT', //ajax put request
			url: '/notes/' + id, // to the PUT /notes/:id route
			data: { id: id, note: { title: title, content: content} },
			success: function(updatedNote) {
				renderNote(updatedNote); // render the single note view with the updated note
				getAllNotes(); // updates the preview note views
			}
		});
	};

	function deleteNote() {
		var id = $(this).parent().attr('data-id');
		$.ajax({
			type: 'DELETE', //ajax delete request
			url: '/notes/' + id, //to the DELETE /notes/:id route
			data: { id: id },
			success: function() {
				getAllNotes(); // updates the preview note views
				renderNewNoteTemplate(); // loads new form template to create new note
			}
		});
	};


	// RENDER FUNCTIONS
	function renderNotePreviews(notes) {
		previewListView.empty();
		notes.forEach(function(note) {
			previewListView.append(previewTemplate({title: note.title, content: note.content, id: note.id}));
		});
	};

	function renderNote(note) {
		noteView.empty();
		noteView.append(noteTemplate({id: note.id, title: note.title, content: note.content}));
	};

	function renderNewNoteTemplate() {
		noteView.empty();
		noteView.append(newNoteTemplate)
	};

	function renderEditNoteTemplate(note) {
		noteView.empty();
		noteView.append(editNoteTemplate({title: note.title, content: note.content, id: note.id}));
	};

});