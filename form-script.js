//Init options
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}


//Calculate total cost for an order
function calc_total(price){
    var sum = 0;
    $('.input-amount').each(function(){
        sum += parseFloat($(this).text());
    });
    $(".preview-total").text(sum.toFixed(2));    
}

//Calculate price for each drink
function get_price(size){
    var price = 0;
    if (size==="Short"){
        price = 1.85;
    }else if(size === "Tall"){
        price = 2.95;
    }else if(size === "Grande"){
        price = 3.65;
    }else{
        price = 4.15;
    }
    return price;
}

//Getting order info
$('.order-now').submit(function(){
    var order = new Array();
    var qty = new Array();
    var drinkNames = new Array();
    var milk = new Array();
    var size = new Array();
    var amt = new Array();

    $('.preview-table .input-quantity').each(function(){
      qty.push($(this).html());
    });
    $('.preview-table .input-name').each(function(){
      drinkNames.push($(this).html());
    });
    $('.preview-table .input-milk').each(function(){
      milk.push($(this).html());
    });
    $('.preview-table .input-size').each(function(){
      size.push($(this).html());
    });
    $('.preview-table .input-amount').each(function(){
      amt.push($(this).html());
    });

    var loc = new Array();
    loc.push($('#location').val());
    if(milk.length === 0){
        alert("----PLEASE MAKE AN ORDER!----");
    }else{
        //compiling an order
        order.push(loc);
        order.push(qty);
        order.push(drinkNames);
        order.push(milk);
        order.push(size);
        order.push(amt);

        var data = JSON.stringify(order)
        $.post( "post.php", {Orderdata: data}, function(response) {
          $(".result" ).html(response);
        });
        
        toastr.success("Your order be placed. Thank you for shopping with Restbucks.", "Order placed!!");
        //alert("Order was PLACED!");
    }
    

    return false;
});


//Remove items from the order
$(document).on('click', '.input-remove-row', function(){ 
    var tr = $(this).closest('tr');
    tr.fadeOut(200, function(){
        tr.remove();
        calc_total()
    });
});

//adding items to the order
$('.add-item').submit(function(){
    var form_data = {};
    form_data["quantity"] = parseFloat($('.payment-form input[name="quantity"]').val());
    form_data["name"] = $('.payment-form #name option:selected').text();
    form_data["milk"] = $('.payment-form #milk option:selected').text();
    form_data["size"] = $('.payment-form #size option:selected').text();
    form_data["amount"] = parseFloat(form_data["quantity"] * get_price($('.payment-form #size option:selected').text())).toFixed(2);
    form_data["remove-row"] = '<span class="glyphicon glyphicon-remove"></span>';
    var row = $('<tr></tr>');
    $.each(form_data, function( type, value ) {
        $('<td class="input-'+type+'"></td>').html(value).appendTo(row);
    });
    $('.preview-table > tbody:last').append(row); 
    calc_total();

    return false;
});  

