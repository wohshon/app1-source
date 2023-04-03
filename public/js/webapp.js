var App = {
    test: function(msg) {
        console.log(msg);
    },
    submitData: function(data) {
        $.ajax({
            method: "POST",
            url: "./submitForm",
            data: data,
            dataType: "text",
            success: function(data) {
                console.log(data);
                let d = JSON.parse(data);
                console.log(`${d.length} records`);
                $('#main_table_tbody').html('');               
                let i = 0;
                d.forEach( row => {
                    $("#main_table tbody").append(App.renderTable(++i, row));
                });
            },
            error: function(error) {
                console.log(Object.keys(error));
                console.log(error.responseText);
            }
          })        
    },
    renderTable: function(cnt, row) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(row.data.timestamp._seconds);

        var header = '<tr>'+
        '<td>$cnt</td>'+
        '<td>$id</td>'
        +'<td>$email</td>'
        +'<td>$comments</td>'        
        +'<td>$timestamp</td>'        
        '</tr>';
        return header 
        .replace('$id',row.id)
        .replace('$comments',row.data.comments)
        .replace('$email',row.data.email)
        .replace('$cnt',cnt)       
        .replace('$timestamp',t.toLocaleString());        
    }
};

// Declaration
class FormData {
    constructor(email, txt) {
      this.email = email;
      this.comments = txt;
    }
  }