$(document).ready(function () {
    var height = $('.navbar-header').height();
    $('#start-content').css('margin-top', height);
    $('#myNavbar a').click(function () {

        if (user_ID == '') {
            alert('Need Login First')
            return
        }

        var atrHref = $(this).attr('href')
        $('.v-m-content').addClass('hide');
        $(atrHref).removeClass('hide');

        $('#myNavbar li').removeClass('active');
        $(this).closest('li').addClass('active');

        if (atrHref == '#calendar') {
            getAllCalendar()
        }

    })

    // $("document").on('click', '#tb-calendar tr td', function() {
    // $('#tb-calendar tr').on('click','td', function () {
    jQuery(document.body).on('click', '#tb-calendar tr td', function(event) {
        // alert(123)
        // alert('123')
        checkDetailCalendar(this)
    })

    //calendar reload 
    $('.prev-month,.next-month').click(function(){
        getAllCalendar()
    })
});

function checkDetailCalendar(at){
    var attrDate = $(at).attr('data-day')
        if (attrDate == undefined) return
        $('#tb-calendar tr td').removeClass('at')
        $(at).addClass('at')

        // console.log($(this).attr('data-day'))
        // alert(attrDate)
        $('#date-at').val(attrDate)
        getCalendarDate(attrDate)
        if ($(at).hasClass('had')) {
            $('#btnAddCalen').hide()
            $('#btnUpdateCalen').show()
            var temp = returnDateDatainALl(attrDate)
            keyCalendar = temp[1]
            $('#date-content').val(temp[0].content)

        } else {
            $('#btnAddCalen').show()
            $('#btnUpdateCalen').hide()
            $('#date-content').val('')
        }
}


var listOption = {};
listOption.note = {
    3.0: 'Different',
    3.1: 'Video/Movie',
    3.2: 'Motivation',
    3.3: 'Music',
    3.4: 'Game',
    3.5: 'Link',
}
listOption.work = {
    1.1: 'Php',
    1.2: 'Wordpress',
    1.3: 'Template',
    1.4: 'Hosting',
    1.5: 'Server',
    1.6: 'Config',
    1.7: 'Codeigniter',
    1.8: 'Work',
}
listOption.learning = {
    2.1: 'Developer',
    2.2: 'Language',
    2.3: 'Love',
    2.4: 'Family',
    2.5: 'Book',
    2.6: 'Author',
}



var firebaseConfig = {
    apiKey: "AIzaSyAuPuaJCP08o5JKW09F1XUWAy5GIiJ_cf8",
    authDomain: "link-save-d79c8.firebaseapp.com",
    databaseURL: "https://link-save-d79c8-default-rtdb.firebaseio.com",
    projectId: "link-save-d79c8",
    storageBucket: "link-save-d79c8.appspot.com",
    messagingSenderId: "567380847437",
    appId: "1:567380847437:web:eaca395ec37919f2f8a504",
    measurementId: "G-RWXYFREXB0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var user_ID = '';

//invokes firebase authentication. 

const auth = firebase.auth();
document.querySelector("#show-register").addEventListener("click", () => {
    showRegistration();
});

const showRegistration = () => {
    document.querySelector("#registration-page").classList.remove("hide");
    document.querySelector("#login-page").classList.add("hide");
    document.querySelector("#homepage").classList.add("hide");
    // document.querySelector(".show-signout").classList.add("hide");
    $('.show-signout').hide()
};

document.querySelector("#show-login").addEventListener("click", () => {
    showLogin();
});

const showLogin = () => {
    document.querySelector("#registration-page").classList.add("hide");
    document.querySelector("#login-page").classList.remove("hide");
    document.querySelector("#homepage").classList.add("hide");
    // document.querySelector(".show-signout").classList.add("hide");
    $('.show-signout').hide()
};

document.querySelector(".signout").addEventListener("click", () => {
    signOut();
});

const register = () => {
    const email = document.querySelector("#registration-email").value;
    const reemail = document.querySelector("#registration-reemail").value;
    const password = document.querySelector("#registration-password").value;

    if (email.trim() == "") {
        alert("Enter Email");
    } else if (password.trim().length < 7) {
        alert("Password must be at least 7 characters");
    } else if (email != reemail) {
        alert("emails do not match");
    } else {
        auth
            .createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                // ...
            });
    }
};

document.querySelector("#register").addEventListener("click", () => {
    register();
});

//register when you hit the enter key
document
    .querySelector("#registration-password")
    .addEventListener("keyup", (e) => {
        if (event.keyCode === 13) {
            e.preventDefault();

            register();
        }
    });

const login = () => {
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    if (email.trim() == "") {
        alert("Enter Email");
    } else if (password.trim() == "") {
        alert("Enter Password");
    } else {
        authenticate(email, password);
    }
};

document.querySelector("#login").addEventListener("click", () => {
    login();
});

//sign in when you hit enter
document
    .querySelector("#login-password")
    .addEventListener("keyup", (e) => {
        if (event.keyCode === 13) {
            e.preventDefault();

            login();
        }
    });

const authenticate = (email, password) => {
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password);
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
};

const showHomepage = () => {
    document.querySelector("#registration-page").classList.add("hide");
    document.querySelector("#login-page").classList.add("hide");
    document.querySelector("#homepage").classList.remove("hide");
    // document.querySelector(".show-signout").classList.remove("hide");
    $('.show-signout').show()
};

const signOut = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            location.reload();
        })
        .catch(function (error) {
            alert("error signing out, check network connection");
        });
};

auth.onAuthStateChanged((firebaseUser) => {

    if (firebaseUser) {
        showHomepage();
        user_ID = firebaseUser.uid
        $('#email_login').html(firebaseUser.email)
        loadData()
        buildSelect()
    }
});

document
    .querySelector("#forgot-password")
    .addEventListener("click", () => {
        const email = document.querySelector("#login-email").value;
        if (email.trim() == "") {
            alert("Enter Email");
        } else {
            forgotPassword(email);
        }
    });

const forgotPassword = (email) => {
    auth
        .sendPasswordResetEmail(email)
        .then(function () {
            alert("email sent");
        })
        .catch(function (error) {
            alert("invalid email or bad network connection");
        });
};

// Ready to function

// var config = {
//     apiKey: "AIzaSyAuPuaJCP08o5JKW09F1XUWAy5GIiJ_cf8",
// 	  authDomain: "link-save-d79c8.firebaseapp.com",
// 	  databaseURL: "https://link-save-d79c8-default-rtdb.firebaseio.com",
// 	  projectId: "link-save-d79c8",
// 	  storageBucket: "link-save-d79c8.appspot.com",
// 	  messagingSenderId: "567380847437",
// 	  appId: "1:567380847437:web:eaca395ec37919f2f8a504",
// 	  measurementId: "G-RWXYFREXB0"
// };

// firebase.initializeApp(config);

//create firebase database reference
var dbRef = firebase.database();
var contactsRef = dbRef.ref('contacts');
//var calendarsRef = dbRef.ref('calendars/useriD');
var calendarsRef = null;
var lengthSize = 0
var last = {}
var last_Key = ''
var pageLength = 5
var allCalendar = {}
var keyCalendar = '';

function loadData() {
    //load older conatcts as well as any newly added one...

    var previousLastKey = ''

    contactsRef.orderByChild('userId').equalTo(user_ID).on("child_added", function (snap) {
        console.log("added", snap.key, snap.val());
        //console.log(snap.val())
        lengthSize++
        console.log(lengthSize)
        $('#size-list').html(lengthSize)
        $('#contacts').append(contactHtmlFromObject(snap.val()));
    });

    /*
    contactsRef.orderBy('time').limit(pageLength).on("child_added", function(snap) {
            console.log("added", snap.key, snap.val());
            // //console.log(snap.val())
            // lengthSize++
            // console.log(lengthSize)
            // $('#size-list').html(lengthSize)
            // $('#contacts').append(contactHtmlFromObject(snap.val()));
            var data = snap.val()
            last_Key = snap.key
            last = data
            showContent(data)
                //return snap.val()
        })
        // console.log(data)
        // showContent(data)
        */
}

function showContent(data) {

    // $('#size-list').html(lengthSize)
    // $('#contacts').append(contactHtmlFromObject(snap.val()));
    lengthSize++
    $('#size-list').html(lengthSize)
    $('#contacts').append(contactHtmlFromObject(data));
}

function getNextPage() {
    return
    console.log(user_ID + '---' + last_Key)
    contactsRef.orderByChild('userId').startAt(user_ID, last_Key).limitToFirst(pageLength).on("child_added", function (snap) {
        // console.log("added", snap.key, snap.val());
        // //console.log(snap.val())
        // lengthSize++
        // console.log(lengthSize)
        // $('#size-list').html(lengthSize)
        // $('#contacts').append(contactHtmlFromObject(snap.val()));
        last_Key = snap.key
        last = data
        var data = snap.val()
        showContent(data)
        //return snap.val()
    })
}

function nextPage(last) {
    return
    return ref.orderBy(field)
        .startAfter(last[field])
        .limit(pageSize);
}

function prevPage(first) {
    return
    return ref.orderBy(field)
        .endBefore(first[field])
        .limitToLast(pageSize);
}

//save contact
$('.addValue').on("click", function (event) {
    event.preventDefault();
    if ($('#name').val() != '' || $('#email').val() != '') {
        contactsRef.push({
            name: $('#name').val().replace(/<[^>]*>/ig, ""),
            email: $('#email').val().replace(/<[^>]*>/ig, ""),
            location: {
                city: $('#city').val().replace(/<[^>]*>/ig, ""),
                state: $('#state').val().replace(/<[^>]*>/ig, ""),
                zip: $('#zip').val().replace(/<[^>]*>/ig, "")
            },
            time: new Date().getTime(),
            userId: user_ID
        })
        contactForm.reset();
    } else {
        alert('Please fill atlease name or email!');
    }
});

function addCalendar() {

    var date = $('#date-at').val()
    var content = $('#date-content').val()
    calendarsRef = dbRef.ref('calendars/' + 'user_' + user_ID)
    calendarsRef.push({
        date: date,
        content: content,
        time: new Date().getTime(),
        userId: user_ID
    })
}

function updateCalendar() {
    var date = $('#date-at').val()
    var content = $('#date-content').val()
    var key = keyCalendar;
    calendarsRef = dbRef.ref('calendars/' + 'user_' + user_ID + "/"+key)
    calendarsRef.update({
        date: date,
        content: content,
        time: new Date().getTime(),
        userId: user_ID
    })
}

function getAllCalendar() {
    calendarsRef = dbRef.ref('calendars/' + 'user_' + user_ID)

    var monthYear = $('#monthyear').attr("month-year")
    var listDate = monthYear.split('/')
    var lastDate = getDaysInMonth(listDate[0], listDate[1])

    var first = new Date(listDate[1], listDate[0], 1).getTime();
    var end = new Date(listDate[1], listDate[0], lastDate).getTime();

    console.log(first, end)
    console.log('reaload')
    alert('reaload')

    //calendarsRef.orderByChild('time').startAt(1608531964751).endAt(1608531997520).on("value", function (snapshot) {
    calendarsRef.orderByChild('time').startAt(first).endAt(end).on("value", function (snapshot) {
        console.log(snapshot.val());
        allCalendar = snapshot.val()
        // console.log(typeof allCalendar)
        // var output =  allCalendar.filter(employee => employee.date == "12/12/2012"); 
        // console.log(output)
        // var startDate = 1;
        // var atday = $('#date-at').val()
        for (var key in allCalendar) {
            // console.log(allCalendar[key])
            var dataAt = allCalendar[key]
            var day = dataAt.date
            $('#tb-calendar').find('td[data-day="' + day + '"]').addClass('had')
            // console.log(day)
            // console.log($('#tb-calendar').find('td[data-day="' + day + '"]'))
        }
        // allCalendar.for
        buildListCalendar(allCalendar)

        // alert(lastDate)

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return
    calendarsRef.on("child_added", function (snap) {


        //alert(1)
        console.log("added - calendar", snap.key, snap.val());
        //console.log(snap.val())
        // lengthSize++
        // console.log(lengthSize)
        // $('#size-list').html(lengthSize)
        // $('#contacts').append(contactHtmlFromObject(snap.val()));
        // last_Key = snap.key
        // last = data
        var data = snap.val()
        allCalendar[snap.key] = {}
        allCalendar[snap.key] = data
        // allCalendar.push(data)
        //$('#date-content').text(data.content)
    })
}

function buildListCalendar(dataIn) {
    dataIn = sortobjkey(dataIn,'time')

    var str = '';
    for (var key in dataIn) {
        str += '<li>'
        // console.log(allCalendar[key])
        var dataAt = dataIn[key]
        var day = dataAt.date
        // $('#tb-calendar').find('td[data-day="'+day+'"]').addClass('had')
        // console.log(day)
        // console.log($('#tb-calendar').find('td[data-day="'+day+'"]'))
        str += '<p>' + day + '</p>'
        str += '<p>' + dataAt.content + '</p>'
        str += '</li>'
    }
    $('#list-calendar').html(str);
}

function sortobjkey(obj, key) {
    if(obj=={} || obj==undefined || obj=='')return {}
    var keys = Object.keys(obj);
    var kva = keys.map(function (k, i) {
        return [k, obj[k]];
    });
    kva.sort(function (a, b) {
        k = key; if (a[1][k] > b[1][k]) return -1; if (a[1][k] < b[1][k]) return 1;
        return 0
    });
    var o = {}
    kva.forEach(function (a) { o[a[0]] = a[1] })
    return o;
}


function returnDateDatainALl(inDay) {
    for (var key in allCalendar) {
        // console.log(allCalendar[key])
        var dataAt = allCalendar[key]
        var day = dataAt.date
        if (day == inDay) {
            return [dataAt,key]
        }
    }
}

function getCalendarDate(date) {
    //getAllCalendar()
    return
    if (date == undefined) return
    $('#date-content').val()
    calendarsRef = dbRef.ref('calendars/' + 'user_' + user_ID)

    //calendarsRef.orderByChild('date').equalTo(date).limitToFirst(1).on("child_added", function (snap) {
    calendarsRef.on("child_added", function (snap) {
        alert(1)
        console.log("added", snap.key, snap.val());
        console.log(snap.val())
        // lengthSize++
        // console.log(lengthSize)
        // $('#size-list').html(lengthSize)
        // $('#contacts').append(contactHtmlFromObject(snap.val()));
        // last_Key = snap.key
        // last = data
        var data = snap.val()
        $('#date-content').text(data.content)

    })
    // calendarsRef.off('value', function () {
    //     alert('2')
    // });
}

//prepare conatct object's HTML
function contactHtmlFromObject(contact) {
    console.log(contact);
    var html = '';
    html += '<li class="list-group-item contact">';
    html += '<div>';
    if (contact.name != '') {
        html += '<p class="lead">' + contact.name + '</p>';
    }
    html += '<p><a href="' + contact.email + '" target="_blank" title="' + contact.email + '">' + contact.email + '</a></p>';
    var textSelect = filterSelect(contact.location.city, listOption)
    if (textSelect != '') {


        var strZip = contact.location.zip == "" ? '' : '--' + contact.location.zip
        var strState = contact.location.state == "" ? '' : ',' + contact.location.state
        html += '<p><small>' + '<b>' + textSelect + '</b>' + strState + strZip + '</small></p>';
    }
    if (contact.time != undefined) {
        var d = new Date(contact.time);
        html += '<p>' + d.toLocaleString() + '</p>';
    }
    html += '</div>';
    html += '</li>';
    return html;
}


function buildSelect() {
    var str = '';
    for (const prop in listOption) {
        str += '<optgroup label="' + prop + '">'
        //console.log(listOption[prop])
        for (const prop1 in listOption[prop]) {
            // console.log(listOption[prop][prop1])
            str += '<option value="' + prop1 + '">' + listOption[prop][prop1] + '</option>'
        }
        str += '</optgroup>'
    }
    //str += '</select>';
    //console.log(str)
    $('.list-select-option').html(str)
}

function filterSelect(atId, oBject) {
    //var strReturn = '';
    for (const prop in oBject) {
        for (const prop1 in oBject[prop]) {
            if (prop1 == atId) {
                return oBject[prop][prop1]
            }
        }
    }
    return ''
}

function getDaysInMonth(m, y) {
    return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
}