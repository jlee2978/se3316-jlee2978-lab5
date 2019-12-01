export interface IUser 
{
    // modelled off of data schema model from user.js in backend
	_id: string,		// implicit _id from mongoDB
    loginid: String,
	password: String,
	role: String,
	status: String
}