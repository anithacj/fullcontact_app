jQuery(function($) {
    $(document).ready(function() {    

        $("#contact_frm").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                phone_number: "required"
            },
            messages: {
              firstname: "First Name is required",
              lastname: "Last Name is required",
              phone_number: "Phone number is required"
            },
            submitHandler: function(form) {
                var mail = $("#email_address").val();
                //console.log("yes mail");

                        $.ajax({
                            url: mc_params.ajaxUrl,
                            data: {
                                'action': 'submit_contacts',
                                'data' : $( "#contact_frm" ).serialize()
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function(response) {
                                //console.log(response.success);
                                //console.log(response.message);
                                if ( response.success ) {
                                    $("#succmsg").show();
                                    $("#succmsg").html(response.message);   
                                }else{
                                    $("#errormsg").show();
                                    $("#errormsg").html(response.message);  
                                }
                                
                            }
                        }); 
            }
        });

        $( "select" ).change(function() {
            //console.log("status");
            //console.log($(this).attr("data-id"));
            var contact_id = $(this).attr("data-id"); 
            var do_stat = $( '#action_'+contact_id ).val();
            //console.log("stat: "+action);
            //console.log(mc_params.ajaxUrl);

            //alert(sel_stat);
            if (do_stat == 0) {
                alert("Please choose one action");
            }else{
                //console.log("stat11: "+action);
                $.ajax({
                    url: mc_params.ajaxUrl,
                    type: 'post',
                    dataType: 'json',
                    data: { 
                      action: 'ntcontactprocess',
                      contact_id: contact_id,
                      do_stat: do_stat
                    },
                    success: function(response) {                      

                       if ( response.do_stat == 1) {
                           if (response.success) {
                               var contact_disp = JSON.parse(response.contact_data);
                                //console.log( contact_disp.first_name );
                                $("#cont_first_name").html(contact_disp.first_name);
                                $("#cont_last_name").html(contact_disp.last_name);
                                $("#cont_email").html(contact_disp.email);
                                $("#cont_phone_number").html(contact_disp.phone_number);
                                $("#cont_title").html(contact_disp.title);
                                $("#cont_linkedIn_url").html(contact_disp.linkedIn_url);
                                $("#cont_organization").html(contact_disp.organization);
                                $("#myModal").modal();
                            }    
                       }else{
                           if (response.success){
                               console.log("deleted");
                               window.location.reload(true);
                           }

                       }
                       

                    }
                });
                //return false;
              
            }    

        }); 



    });
});


function formatPhone( value ) { 
    var numbers = value.replace( /\D/g, '' ),
    char = { 0: '(', 3: ') ', 6: '-' };
    value = '';
    for (var i = 0; i < numbers.length; i++) {
        value += (char[i] || '') + numbers[i];
    }

    return value;
}