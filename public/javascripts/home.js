
$("div#list").click(function () {
    var tag = $(this).attr('tag');
    var code = $(this).attr('code');
    var title=document.getElementById('project_title').innerHTML;

    $.ajax({
        type: 'POST',
        url: '/list',
        data: {
            tag: tag,
            title: title,
            code:code,
        },
    }).done(function (response) { //
        $("#server-results").html(response);
    });
    location.href = '/list';

});

$("div#hr").click(function () {
    var tag = $(this).attr('tag');
    var code = $(this).attr('code');
    var title='hr';

    $.ajax({
        type: 'POST',
        url: '/list',
        data: {
            tag: tag,
            title: title,
            code:code,
        },
    }).done(function (response) { //
        $("#server-results").html(response);
    });
    location.href = '/list';

});

