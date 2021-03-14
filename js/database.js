class JsonExtendsClass
{
  constructor()
  {
    this.m_root = "https://json.extendsclass.com/bin/";
    this.m_bin = "d19ba4868121";
    this.m_url = this.m_root + this.m_bin;
    this.m_apiKey = "0c3782c5-83f7-11eb-a665-0242ac110002";
  }
  async getData(callback=function(){})
  {
    await fetch(this.m_url, {
      headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true'
        }
    })
    .then(response => response.json())
    .then(data => callback(data));
  }
  async setData(data)
    {
      const result = await fetch(this.m_url, {
        method: 'PUT',
        body: data,
        headers: {
          'Content-type': 'application/json',
          'Api-key': this.m_apiKey,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
    }
}

const db = new JsonExtendsClass();