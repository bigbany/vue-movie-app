exports.handler = async function (event, context){
  return{
    statusCode: 200,
    body: JSON.stringify({
      name: 'Heropy',
      age: 100,
      email: 'thesencon@gmail.com'
    })
  }
}