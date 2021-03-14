class Map
{
  constructor()
  {
  
  }
  getCoords(zip = false, city = false, street = '', housenr = '', callback)
  {
    if(!zip || !city) return

    const baseUrl = "https://nominatim.openstreetmap.org/search?";
    let addressString = `q=${zip}+${city}`;
    if(housenr != '') addressString += `+${housenr}`;
    if(street != '') addressString += `+${street}`;

    //addressString = '';
    const addPara = (para,val) =>
    {
      if(val !== false && val !== '')
        addressString += `${para}=${val}+`;
    }
    // addPara('street', `${housenr} ${street}`);
    // addPara('city', city);
    // addPara('postalcode', zip);

    const format = "&format=json&polygon=0&addressdetails=0";
    const url = `${baseUrl}${addressString}${format}`
    
    

    // await fetch(url, {
    //   headers: {
    //       'Content-type': 'application/json',
    //       'Access-Control-Allow-Origin': 'http://localhost:3000',
    //       'Access-Control-Allow-Credentials': 'true'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => callback(data));
    $.getJSON(url, function(data) {

      callback(data)
    });
  }
}

const map = new Map();