var data =[];
var duplicate = false;
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
} );
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.type === "set_data_popup") {
        for (var i=0; i<msg.data.length; i++) {
            for(var j=0; j<data.length; j++){
                if(msg.data[i].name === data[j].name) {
                    duplicate = true;
                    break;
                }
            }
            if(!duplicate){
                data.push(msg.data[i]);
                duplicate = false;
            }
        }
        if(data.length != prelength) {
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
                                    // '<th style="display: none">Profile</th>'+
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
                                // + '<td style="display: none">'+data[i].contact_url+'</td>'
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
            pageLength: 5,
        } );
        // $("#add_more").prop('disabled', true);
        // if(data.length > 0){
        //     $(".dt-button.buttons-csv.buttons-html5")[0].click();
        // }
        $("#loading").hide();
        var pauseTime = Math.random()*100 +200;
        setTimeout(function(){
            $('#next_page').click();
        }, pauseTime);
        prelength = data.length;
}