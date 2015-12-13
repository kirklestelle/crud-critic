$(document).ready(function() {

// Initialize Parse app
Parse.initialize('qcZRDjMFWqcEQyoZoyG7cbm6xbDilhTqoeWHv4hw', 'EkNcbAJiamSnrBId4cC3uC0tDxSQiIFlZnWDxt6B')
var Review = Parse.Object.extend('Review')

$('#reviewRating').raty()

$('#formReview').submit(function() {

	var review = new Review()

	var rating = $('#reviewRating').raty('score')
	var title = $('#reviewTitle').val()
	var body = $('#reviewBody').val()
	review.set('reviewRating', rating)
	review.set('reviewTitle', title)
	review.set('reviewBody', body)
	review.set('voteUp', 0)
	review.set('voteTotal', 0)

	review.save(null, {
		success: getData
	}).then(function(){
		$('#reviewRating').raty({score: 0})
		$('#reviewTitle').val('')
		$('#reviewBody').val('')
	})
	return false;
})

var getData = function() {

	var query = new Parse.Query(Review)
	query.find({
		success: function(results) {
			buildList(results)
		}
	})
}

var buildList = function(data) {

	var ratingTotal = 0
	var reviewsTotal = 0
	$('#reviews').empty()
	data.forEach(function(d) {
		ratingTotal += d.get('reviewRating')
		reviewsTotal += 1
		addItem(d)
	})

	$('#ratingAverage').raty({
		score: ratingTotal/reviewsTotal, 
		readOnly: true,
		half: true
	})
}

var addItem = function(item) {
	var rating = item.get('reviewRating')
	var title = item.get('reviewTitle')
	var body = item.get('reviewBody')
	var voteUp = item.get('voteUp')
	var voteTotal = item.get('voteTotal')
	
	var reviewForm = $("<div class='reviewForm'></div>")
	var reviewRating = $("<div></div>")
	var reviewTitle = $("<h2>" + title + "</h2>")
	var reviewBody = $("<p>" + body + "<p>")
	var question = $("<span class='vote'>Was this review helpful?</span>")
	var usefulness = $("<p>" + voteUp + " of " + voteTotal + " found this review useful.</p>")
	var button = $("<button class='btn-danger btn-xs remove'><span class='glyphicon glyphicon-remove'></span></button>")
	var voteYes = $("<button class='btn btn-success vote'><span>Yes</span></button>")
	var voteNo = $("<button class='btn btn-danger vote'><span>No</span></button>")

	reviewRating.raty({
		score: rating,
		readOnly: true,
		half: true
	})

	button.click(function() {
		item.destroy({
			success: getData
		})
	})

	voteYes.click(function() {
		item.increment('voteUp')
		item.increment('voteTotal')
		item.save(null, {
			success: getData
		})
		return false
	})

	voteNo.click(function() {
		item.increment('voteTotal')
		item.save(null, {
			success: getData
		})
		return false
	})

	reviewRating.append(reviewTitle)
	reviewForm.append(reviewRating)
	reviewForm.append(reviewBody)
	reviewForm.append(question)
	reviewForm.append(voteYes)
	reviewForm.append(voteNo)
	reviewForm.append(usefulness)
	reviewForm.prepend(button)
	$('#reviews').prepend(reviewForm)

}

getData()

});

