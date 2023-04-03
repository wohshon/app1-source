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
                console.log(d.email);
            },
            error: function(error) {
                console.log(Object.keys(error));
                console.log(error.responseText);
            }
          })        
    }
};

// Declaration
class FormData {
    constructor(email, txt) {
      this.email = email;
      this.txt = txt;
    }
  }