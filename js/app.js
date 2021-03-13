//##############################################################################
//Houses
//##############################################################################
let vHouses = new Vue(
{
  el: '#app',
  data: {
    title: 'Hausverwaltung',
    searchQuery: '',
    houses: [],
    url3: 'http://localhost/ms3',
    url1: 'http://ms3.bplaced.net/hps/data/db.json',
    url: 'https://json.extendsclass.com/bin/d19ba4868121',
    apiKey: '0c3782c5-83f7-11eb-a665-0242ac110002'
  },

  mounted()
  {
    this.fetchHouses();
  },

  methods: 
  {
    addHouse(house, toServer = true) 
    {
      if(house.name == '')
        return
      house.space = house.space || 0;

      this.houses.push(house);
      if(toServer)
        this.fetchAddHouse(house) 
    },
    removeHouse(index)
    {
      const house = this.getHouseByIndex(index);
      this.houses.splice(index,1)
      this.fetchDeleteHouse(house.id)

    },
    reset()
    {
      this.houses = []
    },
    editHouse(index)
    {
      const house = this.getHouseByIndex(index);
      if(!house)
        return
      vHouseEditor.index = index;
      vHouseEditor.name = house.name;
      vHouseEditor.zip = house.zip;
      vHouseEditor.city = house.city;
      vHouseEditor.capacity = house.capacity;
      vHouseEditor.space = house.space;
    },
    setHouseVal(index)
    {
      const house = this.getHouseByIndex(index);
      if(!house)
        return
      this.updateHouse(index, house);
    },
    updateHouse(index, houseData)
    {
      this.houses[index].name = houseData.name;
      this.houses[index].zip = houseData.zip;
      this.houses[index].city = houseData.city;
      this.houses[index].capacity = houseData.capacity;
      this.houses[index].space = houseData.space;

      const house = this.getHouseByIndex(index);
      if(!house)
        return
      this.fetchUpdateHouse(house.id, house);
    },
    getHouseByIndex(index)
    {
      return this.houses[index]
    },
    async fetchHouses(house)
    {
      await fetch(this.url, {
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true'
          }
      })
      .then(response => response.json())
      .then(data => 
        {
          for(let house in data)
           this.addHouse(data[house], false)
        });
    },
    async fetchAddHouse(house)
    {
      const result = await fetch(this.url, {
        method: 'PUT',
        body: JSON.stringify(this.houses),
        headers: {
          'Content-type': 'application/json',
          'Api-key': this.apiKey,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
    },
    async fetchUpdateHouse(id, house)
    {
      await fetch(this.url, {
        method: 'PUT',
        body: JSON.stringify(this.houses),
        headers: {
          'Content-type': 'application/json',
          'Api-key': this.apiKey,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
    },
    async fetchDeleteHouse(id)
    {
      await fetch(this.url, {
        method: 'PUT',
        body: JSON.stringify(this.houses),
        headers: {
          'Content-type': 'application/json',
          'Api-key': this.apiKey,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
    }
  },

  computed: 
  {
    filteredHouses()
    {
      if(this.searchQuery)
      {
        return this.houses.filter((item)=>
        {
          return this.searchQuery.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
        })
      }
      else
      {
        return this.houses;
      }
    }
  },

  watch: 
  {
    houses: {
      deep: true,
      handler()
      {
        
      }
    }
  }
})

//##############################################################################
//Modal Editor
//##############################################################################
let vHouseEditor = new Vue(
{
  el: '#houseModals',
  data: {
    name: '',
    zip: '',
    city: '',
    capacity: 0,
    space: 0,
    index: undefined
  }, 
  
  methods: 
  {
    addHouse() 
    {
      const house = 
      {
        name: this.name,
        zip: this.zip,
        city: this.city,
        capacity: this.capacity,
        space: this.space
      }
      vHouses.addHouse(house)
      this.reset();      
    },
    updateHouse(index)
    {
      const house = 
      {
        name: this.name,
        zip: this.zip,
        city: this.city,
        capacity: this.capacity,
        space: this.space
      }
      vHouses.updateHouse(this.index, house);
      this.reset();
    },
    reset()
    {
      this.name = '';
      this.zip = '';
      this.city = '';
      this.capacity = 0;
      this.index = undefined;
      this.space = 0;
    }
  }
});

