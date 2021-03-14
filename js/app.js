//##############################################################################
//Houses
//##############################################################################
let vHouses = new Vue(
{
  el: '#app',
  data: {
    title: 'Hausverwaltung',
    searchQuery: '',
    houses: []
  },

  mounted()
  {
    this._getHouses();
    this.m_notification = $('#toast');
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
        this._setHouses(); 
    },
    removeHouse(index)
    {
      const house = this.getHouseByIndex(index);
      this.houses.splice(index,1)
      this._setHouses();
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
      vHouseEditor.street = house.street;
      vHouseEditor.housenr = house.housenr;
      vHouseEditor.name = house.name;
      vHouseEditor.zip = house.zip;
      vHouseEditor.city = house.city;
      vHouseEditor.phone = house.phone;
      vHouseEditor.email = house.email;
      vHouseEditor.contact = house.contact;
      vHouseEditor.capacity = house.capacity;
      vHouseEditor.space = house.space;
      vHouseEditor.modal.mode = 'edit';
    },
    configAddModal()
    {
      vHouseEditor.modal.mode = 'add';
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
      this.houses[index].street = houseData.street;
      this.houses[index].housenr = houseData.housenr;
      this.houses[index].zip = houseData.zip;
      this.houses[index].city = houseData.city;
      this.houses[index].phone = houseData.phone;
      this.houses[index].email = houseData.email;
      this.houses[index].contact = houseData.contact;
      this.houses[index].capacity = houseData.capacity;
      this.houses[index].space = houseData.space;

      const house = this.getHouseByIndex(index);
      if(!house)
        return
      this._setHouses();
    },
    getHouseByIndex(index)
    {
      return this.houses[index]
    },
    _getHouses()
    {
      const cb = (data) =>
      {
        for(let house in data)
          this.addHouse(data[house], false);
        console.log('Synchronisation erfolgreich')
        ui.showNotification('Synchronisation erfolgreich')
      };
      db.getData(cb)
    },
    _setHouses()
    {
      db.setData(JSON.stringify(this.houses));
      ui.showNotification('Erfolgreich gespeichert')
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
    street: '',
    housenr: '',
    zip: '',
    city: '',
    phone: '',
    email: '',
    contact: '',
    capacity: 0,
    space: 0,
    index: undefined,
    coords: [],
    modal: 
    {
      mode: '',
      title: ''
    }
  }, 
  
  methods: 
  {
    addHouse() 
    {
      const house = 
      {
        name: this.name,
        street: this.street,
        housenr: this.housenr,
        zip: this.zip,
        city: this.city,
        phone: this.phone,
        email: this.email,
        contact: this.contact,
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
        street: this.street,
        housenr: this.housenr,
        zip: this.zip,
        city: this.city,
        phone: this.phone,
        email: this.email,
        contact: this.contact,
        capacity: this.capacity,
        space: this.space
      }
      vHouses.updateHouse(this.index, house);
      this.reset();
    },
    removeHouse()
    {
      vHouses.removeHouse(this.index);
      this.reset();
    },
    reset()
    {
      this.name = '';
      this.street = '';
      this.housenr = '';
      this.zip = '';
      this.city = '';
      this.phone = '';
      this.email = '';
      this.contact = '';
      this.capacity = 0;
      this.index = undefined;
      this.space = 0;
      this.coords = [];
    },
    getCoodinates()
    {
      const cb = (result) =>
      {
        console.log(result)
        if(result && result.length > 0)
          this.coords = [result[0].lon, result[0].lat]
      }
      return map.getCoords(this.zip, this.city, this.street, this.housenr, cb);
    }
  }
});

//##############################################################################
class UI
{
  constructor()
  {
    this.m_notification = $('#toast');
  }
  showNotification(text)
  {
    this.m_notification.find('.toast-body').text(text)
    this.m_notification.toast('show');
  }
}
const ui = new UI();