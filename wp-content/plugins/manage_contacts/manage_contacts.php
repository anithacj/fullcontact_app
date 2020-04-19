<?php
/*
Plugin Name: Manage Contacts
Description: Managing User Contacts
Version: 1.0
Author: Anitha Jayan
*/

function mc_contact_scripts() {

    global $wp_query;

    wp_enqueue_style( 'mc-bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css' );
   	wp_enqueue_style( 'mc-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' ); 
    wp_enqueue_style('contact-styles', plugin_dir_url( __FILE__ ) . 'css/contact.css');
    //wp_enqueue_style( 'gt3-parent-style', get_template_directory_uri(). '/style.css', array(), time(), 'all' );
    
    wp_enqueue_script('jquery');
    wp_enqueue_script('mc-bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js', array(), '3.3.6', true);
    wp_enqueue_script('mc-validate', 'https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js', array(), '', true);
    wp_enqueue_script('mc-modal', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js', array( 'jquery' ), '', true);
    wp_enqueue_script( 'mc-init', plugin_dir_url( __FILE__ ) . 'js/custom.js', array( 'jquery' ), null, true );

    wp_localize_script( 'mc-init', 'mc_params',
        array( 
            'siteUrl' => site_url(),
            'ajaxUrl' => admin_url( 'admin-ajax.php' )
        )
    );
}
add_action( 'wp_enqueue_scripts', 'mc_contact_scripts' );

function mc_contact_form() {	

	?>
	<form id="contact_frm" action="" method="post" novalidate="novalidate" class="wpcf7-form">
        <div class="be-contact-form">
            <div class="be_contact_info">
                
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <h3>Contact Info</h3>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                            	<div id="succmsg"></div>
                            </div>
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                            	<div id="errormsg"></div>
                            </div>
                        </div>    	
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group">
                                    <label class="form-label">First Name<span class="red">*</span></label>
                                    <span class="wpcf7-form-control-wrap">
                                        <input class="form-control" id="firstname" type="text" name="first_name" value="" size="40">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row">    
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group">
                                    <label class="form-label">Last Name<span class="red">*</span></label>
                                    <span class="wpcf7-form-control-wrap">
                                        <input class="form-control" type="text" id="lastname" name="last_name" value="" size="40">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <span class="wpcf7-form-control-wrap">
                                        <input class="form-control" type="email" id="email_address" name="email_address" value="" size="40">
                                    </span>
                                </div>
                            </div>
                		</div>
                        <div class="row">    
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group">
                                    <label class="form-label">Phone Number<span class="red">*</span></label>
                                    <span class="wpcf7-form-control-wrap">
                                        <input class="form-control" type="text" id="phone_number" name="phone_number" value="" size="40">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="be_property_button">
		                <div class="row">
		                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">             
		                        <div class="text-right">
		                            <input type="submit" value="Submit" name="submit" class="wpcf7-form-control wpcf7-submit btn btn-border btn-lg margin-right-15">
		                        </div>
		                    </div>              
		                </div>
            		</div>    
        </div>
    </form>    
    <!-- Modal -->
	  <div class="modal" id="myModal" role="dialog">
	    <div class="modal-dialog">
	    
	      <!-- Modal content-->
	      <div class="modal-content">
	        <div class="modal-header">
	          <h4 class="modal-title">Contact Details</h4>
	        </div>
	        <div class="modal-body">
	        <table class="table">
			    <tbody>
			      <tr>
			        <td>First Name</td>
			        <td><span id="cont_first_name"></span></td>
			      </tr>
			      <tr>
			        <td>Last Name</td>
			        <td><span id="cont_last_name"></span></td>
			      </tr>
			      <tr>
			        <td>Email</td>
			        <td><span id="cont_email"></span></td>
			      </tr>
			      <tr>
			        <td>Phone Number</td>
			        <td><span id="cont_phone_number"></span></td>
			      </tr>
			      <tr>
			        <td>Title</td>
			        <td><span id="cont_title"></span></td>
			      </tr>
			      <tr>
			        <td>LinkedIn Url</td>
			        <td><span id="cont_linkedIn_url"></span></td>
			      </tr>
			      <tr>
			        <td>Organization</td>
			        <td><span id="cont_organization"></span></td>
			      </tr>			      
			    </tbody>
			 </table>	          
	        </div>
	        <div class="modal-footer">
	          <a href="#" rel="modal:close">Close</a>
	        </div>
	      </div>
	      
	    </div>
	  </div>
	  
	</div>

	<?php
}

add_action( 'wp_ajax_submit_contacts', 'submit_contacts_callback' );
add_action( 'wp_ajax_nopriv_submit_contacts', 'submit_contacts_callback' );

function submit_contacts_callback() {

	global $wpdb;
	parse_str( $_POST['data'], $data );
    $contact_email = $data['email_address'];
    $api_key = 'gwTyFdTp8VuJC6I2cWPlMEBD1sAmreMN';
    $table_name = $wpdb->prefix."contacts";
    $first_name = $data['first_name'];
    $last_name = $data['last_name'];

    $results = $wpdb->get_results( "SELECT * FROM wp_contacts WHERE first_name='".$first_name."' AND last_name='".$last_name."'" );
    //print_r($results);
   	$contact_data = $results[0];
   	if (!$contact_data) {
   		

	    if( $contact_email ) {

	        $curl = curl_init();

	         $post_params = "{\"email\":\"{$contact_email}\",\"infer\":false}";

			    curl_setopt_array($curl, array(
			        CURLOPT_URL => "https://api.fullcontact.com/v2/person.json?email=".$contact_email,
			        CURLOPT_RETURNTRANSFER => true,
			        CURLOPT_ENCODING => "",
			        CURLOPT_MAXREDIRS => 10,
			        CURLOPT_TIMEOUT => 30,
			        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			        CURLOPT_CUSTOMREQUEST => "GET",
			        CURLOPT_POSTFIELDS => "",
			        CURLOPT_HTTPHEADER => array(
	                        "Content-Type: application/json",
	                        "cache-control: no-cache",
	                        "X-FullContact-APIKey:".$api_key
	                )
			    ));

			    /*curl_setopt_array( $curl, array(
	                        CURLOPT_URL => 'https://api.fullcontact.com/v3/person.enrich',
	                        CURLOPT_RETURNTRANSFER => true,
	                        CURLOPT_ENCODING => "",
	                        CURLOPT_MAXREDIRS => 10,
	                        CURLOPT_TIMEOUT => 30,
	                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	                        CURLOPT_CUSTOMREQUEST => "POST",
	                        CURLOPT_POSTFIELDS => $post_params,
	                        CURLOPT_HTTPHEADER => array(
	                            "Content-Type: application/json",
	                            "cache-control: no-cache",
	                            "authorization: Bearer " . $api_key
	                        )
	                    )
	                );*/


			    $user_data = curl_exec($curl);
			    $err = curl_error($curl);

			    curl_close($curl);
			    $return = array();

			    if ($err) {
			        $return = '';
			    } else {
			        $user = json_decode( $user_data );
			        //print_r($user);

			        $status = $user->status;
			        $msg = $user->message;
			               
			            	if ($status == 200) {

			            		$organizations = $user->organizations;
			            		$organization_name = $organizations[0]['name'];
			            		$title = $organizations[0]['title'];

			            		$socialProfiles = $user->socialProfiles;
			            		$socialProfiles = $socialProfiles[0];
			            		$LinkedIn_url = $socialProfiles->url;
			            		
								$data = array(
										'first_name' => $data['first_name'],
									    'last_name' => $data['last_name'],
									    'email' => $data['email_address'],
									    'phone_number' => $data['phone_number'],
									    'title' => $title,
									    'organization' => $organization_name,
									    'linkedIn_url' => $LinkedIn_url
									);
								
								$wpdb->insert($table_name,$data);	
								//echo $wpdb->last_query;
			            		wp_send_json( array( 'success' => true, 'message' => 'Data added from the API' ) );
			            		
			            	}elseif ($status == 403) {
			            		wp_send_json( array( 'success' => false, 'message' => $msg ) );
			            	}else{
			            		$data = array(
											'first_name' => $data['first_name'],
											'last_name' => $data['last_name'],
											'phone_number' => $data['phone_number']
										);
													
								$wpdb->insert($table_name,$data);	
								//echo $wpdb->last_query;
								wp_send_json( array( 'success' => true, 'message' => 'Data Added without API Call' ) );

			            	}
			    }

	                /*if( $response->Success ) {
	                    wp_send_json( array( 'success' => true, 'url' => $response->RedirectUrl) );
	                } else {
	                    wp_send_json( array( 'success' => false, 'errorMessage' => $response->Message ) );
	                } */
	            
	    }else{

	    	$data = array(
						'first_name' => $data['first_name'],
						'last_name' => $data['last_name'],
						'phone_number' => $data['phone_number']
					);
								
			$wpdb->insert($table_name,$data);	
			//echo $wpdb->last_query;
			wp_send_json( array( 'success' => true, 'message' => 'Data Added without API Call' ) );

	    }
	}else{
		wp_send_json( array( 'success' => false, 'message' => 'User already exists' ) );

	}    
}


//List Contacts in a table from the DB
function list_contacts($srch=''){
	//print_r($_POST);
	
	global $wpdb;
	if ($srch != ''){
		$allcontacts = $wpdb->get_results("SELECT contact_id,first_name,last_name,phone_number FROM wp_contacts 
												WHERE first_name LIKE '%$srch%' OR last_name LIKE '%$srch%'");
	}else{ 
		$allcontacts = $wpdb->get_results("SELECT contact_id,first_name,last_name,phone_number FROM wp_contacts");
	}	

	//echo $wpdb->last_query;

	foreach ($allcontacts as $singlecontact ) {
		//echo $singlecontact->first_name;
	}

?>
	<div class="table-responsive">
		  <h2>Contacts</h2> 
		  <div class="topnav">
			  <div class="search-container">
			    <form action="" method="post">
			      <input type="text" placeholder="Search.." name="search_txt">
			      <input type="hidden" name="action" value="search_form">
			      <button type="submit" id="srch_submit">Submit</button>
			    </form>
			  </div>
		  </div>

		  <table class="table">
			    <thead>
			      <tr>
			        <th>Firstname</th>
			        <th>Lastname</th>
			        <th>Phone Number</th>
			      </tr>
			    </thead>
			    <tbody>
			    <?php foreach ($allcontacts as $singlecontact ) { ?>	
			      <tr>
			        <td><?php echo $singlecontact->first_name; ?></td>
			        <td><?php echo $singlecontact->last_name; ?></td>
			        <td><?php echo $singlecontact->phone_number; ?></td>
			        <td class="contact_view">
			        	<select id="action_<?php echo $singlecontact->contact_id; ?>" data-id="<?php echo $singlecontact->contact_id; ?>">
			        		<option value="0">Actions</option>
			        		<option value="1">View</option>
			        		<option value="2">Remove</option>
			        	</select>
			        </td>
			      </tr>
			    <?php } ?>  
			    </tbody>
		  </table>
	</div>
<?php

}

add_action( 'wp_ajax_ntcontactprocess', 'process_contact_list' );
add_action( 'wp_ajax_nopriv_ntcontactprocess', 'process_contact_list' );

function process_contact_list(){

	global $wpdb;
    $contact_id = $_POST['contact_id'];
    $do_stat = $_POST['do_stat'];

    // View Contact
    if ($do_stat == 1) {    	

    	$results = $wpdb->get_results( "SELECT * FROM wp_contacts WHERE contact_id=".$contact_id );
    	//print_r($results);

    	$contact_data = $results[0];
    	//print_r($contact_data);

    	$contact_data = json_encode($contact_data);
    	//view_contact_html($contact_data);
		wp_send_json(array('success' => true, 'do_stat' => $do_stat,'contact_data' => $contact_data));
		//echo 1;


    }else{
    	//Delete Contact
    	$sql = 'DELETE FROM '. $wpdb->prefix .'contacts WHERE contact_id = %d;';

	    try {
	        $wpdb->query($wpdb->prepare($sql, array($contact_id)));
	        //return true;
	        wp_send_json(array('success' => true, 'do_stat' => $do_stat));
	    } catch (Exception $e) {
	        wp_send_json(array('success' => false, 'do_stat' => $do_stat));
	    }

    }
    die();

}

function view_contact_html($contact){

?>
	
<?php	
}

function mc_contact_shortcode() {
	ob_start();
	$srch = '';
	if (! empty( $_POST )) {
		$srch = $_POST['search_txt'];
	}
	list_contacts($srch);
	mc_contact_form();

	return ob_get_clean();
}

add_shortcode( 'manage_contact', 'mc_contact_shortcode' );

?>