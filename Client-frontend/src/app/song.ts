export interface ISong
{
    // modelled off of data schema model from songs.js in backend
	_id : String,       // implicit _id from mongoDB
	title: String,		// 30 char
	artist: String,		// 30 char
	album: String,		// 30 char
	year: Number,
	comment: String,	// 30 char
	track: Number,
	genre: Number,
	rating: Number,     // holds number of ratings/reviews
	hidden: String,		// Y or N
	note: String,	    // review note
	review_rating: Number,
	date: String,
	loginid: String	
}