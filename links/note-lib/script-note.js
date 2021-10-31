// firebase.initializeApp({
//     apiKey: 'AIzaSyAuPuaJCP08o5JKW09F1XUWAy5GIiJ_cf8',
//     authDomain: 'link-save-d79c8.firebaseapp.com',
//     projectId: 'link-save-d79c8'
// });




var db = firebase.firestore();

var sizes = localStorage.getItem('split-sizes');
if (sizes) {
    sizes = JSON.parse(sizes);
} else {
    sizes = [15, 25, 60]; // default sizes
}
// https://github.com/nathancahill/split/tree/master/packages/splitjs#installation
Split(['#split-0', '#split-1', '#split-2'], {
    sizes: sizes,
    minSize: 100,
    maxSize: 1000,
    gutterSize: 5,
    snapOffset: 1,
    onDragEnd: function(sizes) {
        localStorage.setItem('split-sizes', JSON.stringify(sizes))
    },
})

const editorText = KothingEditor.create("editor", {
	display: "block",
	width: "100%",
	height: "auto",
	popupDisplay: "full",
	katex: katex,
	toolbarItem: [
	  ["undo", "redo"],
	  ["font", "fontSize", "formatBlock"],
	  [
		"bold",
		"underline",
		"italic",
		"strike",
		"subscript",
		"superscript",
		"fontColor",
		"hiliteColor",
	  ],
	  ["outdent", "indent", "align", "list", "horizontalRule"],
	  ["link", "table", "image", "audio", "video"],
	  ["lineHeight", "paragraphStyle", "textStyle"],
	  ["showBlocks", "codeView"],
	  ["math"],
	  ["preview", "print", "fullScreen"],
	  ["save", "template"],
	  ["removeFormat"],
	],
	callBackSave:function(data){
		event3_save();
	},
	templates: [
	  {
		name: "Template-1",
		html: "<p>HTML source1</p>",
	  },
	  {
		name: "Template-2",
		html: "<p>HTML source2</p>",
	  },
	],
	charCounter: true,
  });

function getListNotes() {
    getNoteListCategory()
}
function hideShowLoadingEditor(is_show){
	//var is_show = $('.full-loading').is(":visible");
	if(is_show == 1){
		$('.full-loading').show();		
	}else{
		$('.full-loading').hide();
	}
	
}

function getNoteListCategory() {
    // console.log('note-list-cat')
    $('#split-0 .list').html('');
    var idUserCategory = user_ID;
    db.collection("note_category/" + idUserCategory + '/category').get().then((querySnapshot) => {
        // console.log(querySnapshot.docs)
        var list = {};
        querySnapshot.forEach((doc) => {

            var data = doc.data();
            list[doc.id] = {};
            list[doc.id]['time'] = data.time;
            list[doc.id]['titleCat'] = data.titleCat;

            // var data = doc.data();
            // var str = '<li data-id="' + doc.id + '" onClick="event1_click(this)">' + data.titleCat + '</li>';
            // $('#split-0 .list').append(str);
        });
        var newObjectSort = sortDescObj(list, 'time');
        for (var key in newObjectSort) {
            var tem = newObjectSort[key];
            var str = '<li data-id="' + key + '" onClick="event1_click(this)">' + tem.titleCat + '</li>';
            $('#split-0 .list').append(str);
        }
        if ($('#split-0 .list li').length > 0) {
            $('#split-0 .list li').eq(0).trigger('click');
        }
		setTotalFooter1(Object.keys(newObjectSort).length);
    });
}

function deleteNoteCategory(idCategory) {
    var idUserCategory = user_ID;
    db.collection("note_category/" + idUserCategory + '/category/' + idCategory).delete().then(() => {
        // console.log("Document cat successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


var idCategory_selected = '';
var idPost_selected = '';

function getNoteListPost(idCategory) {
    // console.log('note-list-post')
    $('#split-1 .list').html('');
    var idUserCategory = user_ID;
    db.collection("note_category/" + idUserCategory + '/category/' + idCategory + '/post').get().then((querySnapshot) => {
        // var listData = querySnapshot.docs;
        // console.log(listData[0].data())
        var list = {};
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            list[doc.id] = {};
            list[doc.id]['time'] = data.time;
            list[doc.id]['titlePost'] = data.titlePost;

            // console.log(doc.id, doc.data())

            // var str = '<li data-id="' + doc.id + '" onClick="event2_click(this)">' + data.titlePost + '</li>';
            // $('#split-1 .list').append(str);
        });
        // console.log(list)
        var newObjectSort = sortDescObj(list, 'time');
        for (var key in newObjectSort) {
            //const element = array[index];
            var tem = newObjectSort[key];
            var str = '<li data-id="' + key + '" onClick="event2_click(this)">' + tem.titlePost + '</li>';
            $('#split-1 .list').append(str);
        }
        if ($('#split-1 .list li').length > 0) {
            idPost_selected = Object.keys(newObjectSort)[0]
            $('#split-1 .list li').eq(0).trigger('click');
        }
		setTotalFooter2(Object.keys(newObjectSort).length);

    });
}

function getNoteCategory(dataId) {
    var idUserCategory = user_ID;
    var idCategory = dataId.catId;
    // var idPost = dataId.postId;
    // console.log(dataId)
    // console.log(idCategory)

    db.collection("note_category/" + idUserCategory + '/category').doc(idCategory).get().then((doc) => {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            var docData = doc.data();
            // $('#kothing-editor_editor').html(docData.contentPost);
            $('#split-0 .list li.active').html(docData.titleCat);

        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
        }
        $('#footer1-1').html('loaded');
    }).catch((error) => {
        console.log("Error getting document:", error);
        $('#footer1-1').html('loaded');
    });
}

function getNotePost(dataId, at) {
    var idUserCategory = user_ID;
    var idCategory = dataId.catId;
    var idPost = dataId.postId;

    db.collection("note_category/" + idUserCategory + '/category/' + idCategory + '/post').doc(idPost).get().then((doc) => {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            var docData = doc.data();
            //$('#kothing-editor_editor .kothing-editor-editable').html(docData.contentPost);
			editorText.setContents(docData.contentPost);
			
            $(at).html(docData.titlePost);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        $('#footer3-1').html('loaded');
		hideShowLoadingEditor(0);
    }).catch((error) => {
        console.log("Error getting document:", error);
        $('#footer3-1').html('loaded error');
		hideShowLoadingEditor(0);
    });
}

function deleteNotePost(idCategory, idPost) {
    var idUserCategory = user_ID;
    db.collection("note_category/" + idUserCategory + '/category/' + idCategory + '/post').doc(idPost).delete().then(() => {
        // console.log("Document post successfully deleted!");
        reload_list_title();
    }).catch((error) => {
        console.error("Error removing document: ", error);
        alert('delete post false, reload')
        reload_list_title();
    });
}

function addNoteCategory(dataIn) {
    var idUserCategory = user_ID;
    db.collection("note_category/" + idUserCategory + "/category").add({
            titleCat: dataIn.title,
            aliasCat: "",
            contentCat: "",
            time: new Date().getTime(),
        })
        .then(function(docRef) {
            // console.log("Document written with ID: ", docRef.id);
            getNoteListCategory();
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            alert('error add cat');
            getNoteListCategory();
        });
}

function updateNoteCategory(dataIn) {
    var idUserCategory = user_ID;
    // db.collection("note_category/" + idUserCategory + "/category").update({
    //         titleCat: dataIn.title,
    //         aliasCat: "",
    //         contentCat: "",
    //         time: new Date().getTime(),
    //     })
    //     .then(function(docRef) {
    //         console.log("Document written with ID: ", docRef.id);
    //     })
    //     .catch(function(error) {
    //         console.error("Error adding document: ", error);
    //     });

    var batch = db.batch();
    // var sfRef = db.collection("cities").doc("SF");
    // var sfRef = db.collection("note_category/" + idUserCategory + "/category").doc("SF");
    var idCat = idCategory_selected;
    var sfRef = db.collection("note_category/" + idUserCategory + "/category").doc(idCat);
    batch.update(sfRef, { "titleCat": dataIn.titleCat });

    batch.commit().then(() => {
        // ...
        console.log('update-done')
        $('#footer1-1').html('saved');
        $('#footer1-1').html('reload');
        // reload_list_cat()
        var tem = {};
        tem.catId = idCat;
        getNoteCategory(tem)
    });

}

function addNoteTitle(data) {
    var idUserCategory = user_ID;
    var idCategory = data.catId;
    db.collection("note_category/" + idUserCategory + "/category/" + idCategory + '/post').add({
            titlePost: data.title,
            aliasPost: "",
            contentPost: "",
            time: new Date().getTime(),
        })
        .then(function(docRef) {
            // console.log("Document written with ID: ", docRef.id);
            reload_list_title();
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            alert('error, reload');
            reload_list_title();
        });
}

function updateNotePost(dataIn) {
    var idUserCategory = user_ID;
    var idCategory = idCategory_selected;
    var idPost = idPost_selected;
    var batch = db.batch();
    if (idCategory == '' || idCategory == "") {
        return;
    }
    if (idPost == '' || idPost == "") {
        return;
    }

    var sfRef = db.collection("note_category/" + idUserCategory + "/category/" + idCategory + '/post').doc(idPost);
    var dataUpdate = {};
    if (typeof dataIn.contentPost != 'undefined') {
        dataUpdate.contentPost = dataIn.contentPost;
    }
    if (typeof dataIn.titlePost != 'undefined') {
        dataUpdate.titlePost = dataIn.titlePost;
    }
    batch.update(sfRef, dataUpdate);

    batch.commit().then(() => {
        // ...
        // console.log('update-post-done')
        $('#footer3-1').html('saved');
		hideShowLoadingEditor(0);
        reload_list_post()
    });
}

//1111
function event1_add() {
    var answer = prompt('Add Category?', 'New category');
    var data = {};
    data.title = answer;
    addNoteCategory(data);
}

function event1_edit() {
    var text = $('#split-0 .list li.active').html();
    var answer = prompt('Category Edit?', text);
    if (answer == null) {
        return;
    }


    // var answer = prompt('Title Edit?', text);
    // if (answer == null) {
    //     return;
    // }
    // console.log(answer)
    var data = {};
    // var str = $('#kothing-editor_editor').html();
    data.titleCat = answer;
    updateNoteCategory(data);
}

function event1_delete() {
    var answer = confirm('Do you want delete Category?');
    if (answer == null) {
        return;
    }
    // console.log(answer)
}

function event1_click(at) {
    // console.log(at)

    var id = at.getAttribute('data-id');
    idCategory_selected = id;
    getNoteListPost(id);
	
	hideShowLoadingEditor(1);

    $('#split-0 .list li').removeClass('active');
    $(at).addClass('active');
}

//2222
function event2_add() {
    var answer = prompt('Add title?', 'Joe Blogg');
    if (answer == null) {
        return;
    }
    // console.log(answer)
    var data = {};
    data.title = answer;
    data.catId = idCategory_selected;
    addNoteTitle(data);
}

function reload_list_title() {
    $('#split-0 .list li.active').trigger('click');
}

function reload_list_post() {
    $('#split-1 .list li.active').trigger('click');
}

function reload_list_cat() {
    getNoteListCategory();
}

function event2_edit() {
    var text = $('#split-1 .list li.active').html();
    var answer = prompt('Title Edit?', text);
    if (answer == null) {
        return;
    }
    // console.log(answer)
    var data = {};
    var str = $('#kothing-editor_editor .kothing-editor-editable').html();
    data.titlePost = answer;
    updateNotePost(data);
}

function event2_delete() {
    var answer = confirm('Do you want delete Post?');
    // console.log(answer)
    if (answer == true) {
        var idCategory = idCategory_selected;
        var idPost = idPost_selected;
        deleteNotePost(idCategory, idPost)
    }
}

function event2_click(at) {
    // console.log(at)

    var id = at.getAttribute('data-id');
    idPost_selected = id;
    var data = {};
    data.catId = idCategory_selected;
    data.postId = idPost_selected;


    $('#split-1 .list li').removeClass('active');
    $(at).addClass('active');

    $('#footer3-1').html('loading');
	hideShowLoadingEditor(1);
    // console.log(data)
    getNotePost(data, at);

}

//33333

function event3_save() {
    $('#footer3-1').html('saving...');
	hideShowLoadingEditor(1);
    var data = {};
    var str = $('#kothing-editor_editor .kothing-editor-editable').html();
    data.contentPost = str;
    updateNotePost(data);
}

function setTotalFooter2(num){
	$('#split-1 .footer .footer-sp-right').html(num);
}
function setTotalFooter1(num){
	$('#split-0 .footer .footer-sp-right').html(num);
}