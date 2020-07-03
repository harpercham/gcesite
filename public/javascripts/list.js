
var title, tag, url, cred, sheetname, tabSeq, field, signpad, whatsapp, image, index, signKey, signValues, fieldKey, signIndex, fileURL;

//////////////////////////////////////////////////////////////////////function //////////////////////////////////////////////////////////////////////////////////////////
function mapSingature() {
    var wrapper = document.getElementById("signature-pad");
    var clearButton = wrapper.querySelector(".clearButton");
    var cancelButton = wrapper.querySelector(".cancelButton");
    var saveButton = wrapper.querySelector(".saveButton");
    var canvas = wrapper.querySelector("canvas");


    var signaturePad = new SignaturePad(canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)'
    });

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        signaturePad.clear();
    }

    // On mobile devices it might make more sense to listen to orientation change,
    // rather than window resize events.
    window.onresize = resizeCanvas;
    resizeCanvas();


    clearButton.addEventListener("click", function (event) {
        signaturePad.clear();
    });

    cancelButton.addEventListener("click", function (event) {
        $('#signature-pad').css("display", "none");
        $(' a.signature-background').css("display", "none");
        $("input[index=".concat(signIndex, ']')).attr("dataURL", '')
        $("input[index=".concat(signIndex, ']')).val("Click here to sign")
        $("input[index=".concat(signIndex, ']')).css("color", "red");
        $('#popup1 .popup').css("display", "block");
        $('#popup_sign .popup').css("display", "none");
    });

    saveButton.addEventListener("click", function (event) {
        var canvas = document.getElementById('canvas');
        var dataURL = canvas.toDataURL();
        $('#signature-pad').css("display", "none");
        $(' a.signature-background').css("display", "none");
        $("input[index=".concat(signIndex, ']')).attr("dataURL", dataURL)
        $("input[index=".concat(signIndex, ']')).val('Signed!')
        $("input[index=".concat(signIndex, ']')).css("color", "green");
        $('#popup1 .popup').css("display", "block");
        $('#popup_sign .popup').css("display", "none");
    });

}

function cancel() {
    location.reload();
};

function genPDF(parent) {

    var dataURL = [];
    var img = new Image()
    img.src = image;
    var doc = new jsPDF()
    var type = image.substr(image.length - 3);
    var form_data = $("#my_form".concat(parent)).serializeArray();

    try {
        doc.addImage(img, type, 0, 0, 210, 297);
        var jsonfield = JSON.parse(field);
        var valueStr = Object.values(jsonfield);
        signKey.map(function (num, x) {
            dataURL.push($("input[index=".concat(x, ']')).attr('dataURL'))
        })
        for (var i = 0; i < form_data.length; i++) {
            var valueArr = Array.from(valueStr[i].split(','));

            doc.setFontSize(valueArr[2]);
            doc.text(form_data[i].value, valueArr[0] * 2.1, valueArr[1] * 2.97 + valueArr[2] * 0.297);
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for (var j = 0; j < dataURL.length; j++) {
            var signPos = Array.from(signValues[j].split(','));
            if (dataURL[j] !== undefined) {
                doc.addImage(dataURL[j], type, signPos[0] * 2.1, signPos[1] * 2.97 + 2.97, signPos[2] * 2.1, signPos[3] * 2.97);
            };
        };

        Date.prototype.toShortFormat = function () {
            var month_names = ["Jan", "Feb", "Mar",
                "Apr", "May", "Jun",
                "Jul", "Aug", "Sep",
                "Oct", "Nov", "Dec"];

            var day = this.getDate();
            var month_index = this.getMonth();
            var year = this.getFullYear();

            return "" + day + "-" + month_names[month_index] + "-" + year;
        }
        doc.save(title.concat('-', new Date().toShortFormat()))
    }
    catch{
        alert('this form cannot generate pdf');
    };
};

//////////////////////////////////////////////////////////////////jquery event handler ////////////////////////////////////////////////////////////////////////
$("div.container").click(function () {

    title = decodeURI($(this).attr('title'));
    tag = decodeURI($(this).attr('tag'));
    url = decodeURI($(this).attr('url'));
    cred = decodeURI($(this).attr('cred'));
    sheetname = decodeURI($(this).attr('sheetname'));
    tabSeq = decodeURI($(this).attr('tabSeq'));
    field = decodeURI($(this).attr('field'));
    signpad = decodeURI($(this).attr('signpad'));
    whatsapp = decodeURI($(this).attr('whatsapp'));
    image = decodeURI($(this).attr('image'));
    index = $(this).attr('index');
    fieldKey = Object.keys(JSON.parse(field));
    signKey = Object.keys(JSON.parse(signpad));
    signValues = Object.values(JSON.parse(signpad));

    $(".list").css("display", "none");
    $('#popup'.concat(index, ' .popup')).css("display", "block");

    //eliminate non existence signpad
    if (signpad.includes('[')) {
        signKey = '';
        signValues = '';
    };

    ///////////////////////////////////////////////////////////////
    $("input[type=file]").on('change', function () {
        alert(this.files[0].name);
        var parent = $(this).attr('parent');
        let fileList = $('input[type=file][parent='.concat(parent, ']'));
        var x = 0;
        fileURL = [];
        function pushURL() {

            if (x == fileList.length) { return }
            let file = fileList[x].files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                fileURL.push(reader.result);
                pushURL();
            }
            if (file) {
                reader.readAsDataURL(file);
            };
            x = x + 1;
        };
        pushURL();
    });

    //////////////////////////////////////////////////////////////////////
    $("#my_form".concat(index)).submit(function (event) {
        event.preventDefault(); //prevent default action 
        var post_url = $(this).attr("action"); //get form action url
        var request_method = $(this).attr("method"); //get form GET/POST method
        var form_data = ($(this).serializeArray());
        //form data tidy up
        let form_dataKey = Object.keys(form_data).map(function (num, index) {
            return decodeURI(form_data[index].name);
        });
        var x = 0;
        let Newform_data = fieldKey.map(function (num, index) {
            if (!(fieldKey[index].includes('(upload)'))) {
                var dataKey = form_dataKey.findIndex(item => item === fieldKey[index]);
                return (form_data[dataKey]);
            }
            else {
                let obj = {}
                obj.name = fieldKey[x];
                obj.value = fileURL[x];
                x = x + 1;
                return obj
            }
        });

        for (var i = 0; i < signKey.length; i++) {
            let obj = {};
            obj.name = $("input[index=".concat(i, ']')).attr('name');
            obj.value = $("input[index=".concat(i, ']')).attr('dataURL');
            if (obj.value == undefined) {
                obj.value = ''
            }
            Newform_data.push(obj);
        };
        // tidy up finish


        //ajax post
        $.ajax({
            type: request_method,
            url: post_url,
            data: {
                form_data: Newform_data,
                form_title: title,
                form_tag: tag,
                form_url: url,
                form_cred: cred,
                form_sheetname: sheetname,
                form_tabSeq: tabSeq,
                form_field: field,
                form_signpad: signpad,
                form_whatsapp: whatsapp,
                form_image: image,
            },

        }).done(function (response) { //
            $("#server-results").html(response);
        });
        alert('submit successfully!')
        // window.location = '#'
        //window.setTimeout(function () { location.reload() }, 1000)

    });
});










$("button#genpdf").click(function () {
    var parent = $(this).attr('parent');
    genPDF(parent);
});

$("button#close").click(function () {
    cancel();
});

$("input[id=sign]").click(function () {
    signIndex = $(this)[0].getAttribute('index');
    $('.popup').css("display", "none");
    $('#signature-pad').css("display", "flex");
    $(' a.signature-background').css("display", "flex");

    mapSingature(signIndex);


});

$(".saveButton").click(function () {
    var canvas = document.getElementById('canvas');
    var dataURL = canvas.toDataURL();
    $("input[index=".concat(signIndex, ']')).attr("dataURL", dataURL)
    $("input[index=".concat(signIndex, ']')).val('Signed!')
    $("input[index=".concat(signIndex, ']')).css("color", "green");
    $('#popup1 .popup').css("display", "block");
    $('#popup_sign .popup').css("display", "none");

});



$("button#whatsapp").click(function () {
    var whatsmateInfo = (JSON.parse(whatsapp));
    var group_name = (new Array(whatsmateInfo.groupname.split('&&&')[0])).toString();
    var group_admin = (new Array(whatsmateInfo.groupname.split('&&&')[1])).toString();
    var group_items = new Array(whatsmateInfo.item.split(","))[0];
    var parent = $(this).attr('parent');
    var form_data = $("#my_form".concat(parent)).serializeArray();
    let whatsapp_content = {};

    //map whatsapp content as json 
    group_items.map(function (val, id) {
        for (var i = 0; i < form_data.length; i++) {
            if (val == decodeURI(form_data[i].name)) {
                whatsapp_content[val] = form_data[i].value
                return
            };
        };
    });
    var message = JSON.stringify(whatsapp_content).replace(/,/g, '\n').replace(/"/g, '').replace(/{/g, '').replace(/}/g, '');

    $.ajax({
        type: 'POST',
        url: '/whatsapp',
        data: {
            group_name: group_name,
            group_admin: group_admin,
            message: message,
        },

    }).done(function (response) { //
        $("#server-results").html(response);
    });


    alert('Please wait for the loading patiently, it may take a few minutes!')


})


