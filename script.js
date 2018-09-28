// initializing global variables
var menu = {
	"Drip Coffee (12oz)": 1.25,
	"Drip Coffee (16oz)": 1.50,
	"Americano (12oz)": 1.50,
	"Americano (12oz)": 1.75,
	"tea": 2.50,
	"hot chocolate": 2.00,
	"lunch": 5.1
};
var order = {};
var total_price = 0.00;
var button_begin = '<button id=\'down\' id=\'';
var div_begin = '<div id=\'btn\' class=\'btndown\'></div>';

function realmReset() {
	total_price = 0.00;
	$.each(order, function(key, value) {
		order[key] = 0;
	})
	updateRHS();
}

function updateRHS() {
	$("#rhs").empty();
	var sum = 0.0;
	$.each(order, function(key, value) {
		if(value != 0 && key != "total") {
			$("#rhs").append("<div id=\'asdf\'>" + key + ": " + order[key] + "\t$" + menu[key] * order[key] + "</div>");
			sum += menu[key] * order[key];
		}
	});
	if(sum != 0.0) {
		$("#rhs").append("<div id=\"totalprice\">Total price: $" + sum.toFixed(2) + "</div>");
	}
	$("#rhs").append("<div class=\"orderButton\">Send order!</div>");
	$("#rhs").append("<div class=\"resetButton\">Reset order!</div>");
}

function resetListen() {
	$(".resetButton").on("click", function(){
		realmReset();
		updateRHS();
	});
}

function orderListen() {
	$(".orderButton").on("click", function(){
		console.log(order);
		$.ajax({
			method: "GET",
			url: "http://10.74.1.3:5000/",
            contentType: 'application/json',
			dataType: 'jsonp',
			data: JSON.stringify(order),
			processData: false,
            crossDomain: true,
		})
	});
}

$(document).ready(function(){
	console.log("ready!");
	// adding menu items to website at load
	// beware, there is an extremely long line of code below
	$.each(menu, function(key, value) {
		$('#lhs').append("<div id=\'" + key + "\' class=\'orderBigBox\'>"+ button_begin+key+'\'>'+key+': $'+value.toFixed(2)+div_begin+'</button><div id=\'orderContainer\' class=\'hidden\'>Amt: <textarea placeholder=\'0\' rows=\'1\' cols=\'5\'></textarea><div class=\'addButton\'>Add to order</div></div></div>');
		order[key] = 0;
	});
	order["total"] = 0;

	// init animations when click on menu item
	$("button").on("click", function(){
		if($(this).attr("id") === "down") {
			$(this).removeAttr("id");
			$(this).attr("id", "up");
			var btn = $(this).find("#btn");
			btn.removeClass("btndown");
			btn.addClass("btnup");
			$(this).siblings("#orderContainer").removeClass("hidden");
		}
		else {
			$(this).removeAttr("id");
			$(this).attr("id", "down");
			var btn = $(this).find("#btn");
			btn.removeClass("btnup");
			btn.addClass("btndown");
			$(this).siblings("#orderContainer").addClass("hidden");
		}
	});

	$(".addButton").on("click", function(){
		var type_of_thing = $(this).parent().parent().attr("id");
		var amt = parseInt($(this).siblings("textarea").val());
		var price = menu[type_of_thing] * amt;
		total_price += price;
		order["total"] = total_price;
		order[type_of_thing] += amt;
		updateRHS();
		orderListen();
		resetListen();
	});

	orderListen();
	resetListen();

});
