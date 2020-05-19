var data =[];
var firstpage = true;
var prelength = 0;

$(document).ready( function () {
    $("#loading").hide();
    $('#close').click(function(){
        chrome.runtime.sendMessage({type: "close"});
    })
    $('#refresh').on('click', function(){
        data=[];
        prelength = 0;
        firstpage = true;
        $('#result_table_view').html('');
    })
    $('#next_page').on('click', function(){
        $("#loading").show();
        if(firstpage) {
            chrome.runtime.sendMessage({type: "get_data"});
            firstpage = false;
        } else {
            chrome.runtime.sendMessage({type: "next_page"});
        }
    })
    // $('#save_data').click(function(){
    //     saveData();
    // })
    $('#usr').on('keyup', function(e){
        var searchval = e.target.value;
        console.log("search name: ", searchval);
        searchName(searchval);
    })
} );
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.type === "set_data_popup") {
        saveData(msg.data);
        for (var i=0; i<msg.data.length; i++) {
            if(msg.data[i].profile === "") {
                $('#refresh').click();
                alert("Something went wrong, Maybe profile view has been blocked!");
                break;
            }
            var duplicate = false;
            for(var j=0; j<data.length; j++){
                if(msg.data[i].profile === data[j].profile) {
                    duplicate = true;
                    break;
                }
            }
            if(!duplicate){
                data.push(msg.data[i]);
            }
        }
        if(data.length > prelength) {
            display(data);
        } else {
            $("#loading").hide();
        }
    }
    if(msg.type === "next_page_ready_popup") {
        chrome.runtime.sendMessage({type: "get_data"});
    }
});

function display(data) {
    $('#result_table_view').html('');
        var tableHtml = ' <table id="example" class="display nowrap" style="width:100%">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th>Name</th>'+
                                    '<th>Position</th>'+
                                    '<th>CompanyName</th>'+
                                    '<th>Location</th>'+
                                    '<th>Profile</th>'+
                                    '<th>Phone</th>'+
                                    '<th>Email</th>'+
                                    '<th>Url</th>'+
                                    '<th>Social</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>';
        for(var i=0; i<data.length; i++){
            tableHtml +=  '<tr>'
                                + '<td>'+data[i].name+'</td>'
                                + '<td>'+data[i].position+'</td>'
                                + '<td>'+data[i].company+'</td>'
                                + '<td>'+data[i].location+'</td>'
                                + '<td><a href="https://www.linkedin.com/sales/people/'+data[i].profile+'">https://www.linkedin.com/sales/people/'+data[i].profile+'</a></td>'
                                + '<td>'+data[i].phone+'</td>'
                                + '<td>'+data[i].email+'</td>'
                                + '<td>'+data[i].url+'</td>'
                                + '<td>'+data[i].social+'</td>'
                            + '</tr>';
                   
            }
        tableHtml += '</tbody></table>';
        $('#result_table_view').html(tableHtml);
        $('#example').DataTable( {
            bDestory: true,
            dom: 'Bfrtip',
            buttons: [
                'copy',
                {
                extend: 'csv',
                text : 'CSV',
                filename: function(){
                                var d = new Date();
                                var n = d.getTime();
                                return 'myfile' + n;
                            }
                        },
                'excel', 'pdf', 'print'
            ],
            pageLength: 10,
        } );
        
        $("#loading").hide();
        start_timer();
        prelength = data.length;
}

function start_timer() {
    var seconds_left = 0;
    if($("#running_type").is(":checked")) {
        seconds_left = Math.floor(Math.random()*30) + 30;  // manual
    } else {
        seconds_left = Math.floor(Math.random()*120) + 180;  // auto
    }
    var interval = setInterval(function() {
        --seconds_left;
        var mins = Math.floor(seconds_left/60);
        var secs = Math.floor(seconds_left%60);
        if(secs<10){
            secs = "0" + secs;
        }
        $('#timer_div').html(mins + ":" + secs);
        if (seconds_left <= 0)
        {
            $('#timer_div').html("You are Ready!");
            clearInterval(interval);
            $("#next_page").prop("disabled", false);
            if(!$("#running_type").is(":checked")) {
                $('#next_page').click();
            }
        } else {
           $("#next_page").prop("disabled", true);
        }
    }, 1000);
}

function saveData(newdata) {
    $.ajax({
        type: 'POST',
        // url: 'http://localhost/email_finder/create.php',
        url: 'https://www.linkedin.williamtwiner.com/create.php',
        data: {data: newdata}
    });
}

function searchName(val) {
    var newdata = []
    for(var i=0; i<data.length; i++) {
        if(data[i].name.includes(val)) {
            newdata.push(data[i]);
        }
    }
    newdisplay(newdata);
}

function newdisplay(data) {
    $('#result_table_view').html('');
        var tableHtml = ' <table id="example" class="display nowrap" style="width:100%">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th>Name</th>'+
                                    '<th>Position</th>'+
                                    '<th>CompanyName</th>'+
                                    '<th>Location</th>'+
                                    '<th>Profile</th>'+
                                    '<th>Phone</th>'+
                                    '<th>Email</th>'+
                                    '<th>Url</th>'+
                                    '<th>Social</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>';
        for(var i=0; i<data.length; i++){
            tableHtml +=  '<tr>'
                                + '<td>'+data[i].name+'</td>'
                                + '<td>'+data[i].position+'</td>'
                                + '<td>'+data[i].company+'</td>'
                                + '<td>'+data[i].location+'</td>'
                                + '<td><a href="https://www.linkedin.com/sales/people/'+data[i].profile+'">https://www.linkedin.com/sales/people/'+data[i].profile+'</a></td>'
                                + '<td>'+data[i].phone+'</td>'
                                + '<td>'+data[i].email+'</td>'
                                + '<td>'+data[i].url+'</td>'
                                + '<td>'+data[i].social+'</td>'
                            + '</tr>';
                   
            }
        tableHtml += '</tbody></table>';
        $('#result_table_view').html(tableHtml);
        $('#example').DataTable( {
            bDestory: true,
            dom: 'Bfrtip',
            buttons: [
                'copy',
                {
                extend: 'csv',
                text : 'CSV',
                filename: function(){
                                var d = new Date();
                                var n = d.getTime();
                                return 'myfile' + n;
                            }
                        },
                'excel', 'pdf', 'print'
            ],
            pageLength: 10,
        } );
}