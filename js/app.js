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
    meta:
    {
      lastSaved: '',
      lastAccess: ''
    }
  },

  mounted()
  {
    this._getData();
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
        this._saveData(); 
    },
    removeHouse(index)
    {
      const house = this.getHouseByIndex(index);
      this.houses.splice(index,1)
      this._saveData();
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
      if(!house) return
      
      this.updateHouse(index, house);
    },
    updateHouse(index, houseData)
    {
      const house = this.getHouseByIndex(index);
      if(!house) return

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

      this._saveData();
    },
    getHouseByIndex(index)
    {
      return this.houses[index]
    },
    _getData()
    {
      const loadCb = (data,err) =>
      {
        if(err != undefined)
        {
          ui.addNotification(`Synchronisation fehlgeschlagen (Error: ${err})`, 'error');
          return
        }

        if(data.meta == undefined)
        {
          for(let house in data)
          this.addHouse(data[house], false);
        }
        else
        {
          this.meta = data.meta;
          const houses = data.houses
          for(let house in houses)
            this.addHouse(houses[house], false);
        };

        ui.addNotification('Synchronisation erfolgreich','ok',2000);
      };

      db.getData(loadCb)
    },
    _saveData()
    {
      this.meta.lastSaved = moment().format('LLL');
      const data = 
      {
        meta: this.meta,
        houses: this.houses
      }

      const saveCb = (err) =>
      {
        if(err != undefined)
        {
          ui.addNotification(`Speichern fehlgeschlagen (Error: ${err})`, 'error');
          return
        }
        ui.showNotification('Erfolgreich gespeichert','ok',2000)
      }
      db.setData(JSON.stringify(data),saveCb);
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
    this.m_notificationContent = this.m_notification.find('.toast-body')

    this.m_toastStack = $('#toast-stack');

    this.initMoment();
    this.initModals();
  }

  // ............
  showNotification(data,type='ok',duration)
  {
    this.m_notification.toggleClass('bg-danger', type=='error');
    this.m_notificationContent.html(data);
    this.m_notification.toast('show');
  }

  // ............
  addNotification(data,type,duration)
  {
    let toastEl = 
      $('<div id="toast" class="toast text-white bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true"/>')
      .toggleClass('bg-danger', type=='error')

    const toastHeader = 
      $(`<div class="toast-header">
          <strong class="me-auto">Fehler</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
         </div>`);
    const toastContent = $(`<div class="toast-body">${data}</div>`);

    if(duration === undefined) 
      toastEl.append(toastHeader);
    
    toastEl.append(toastContent).appendTo(this.m_toastStack)
    let opts = 
    {
      autohide: duration != undefined
    }
    if(duration != undefined)
      opts.delay = duration;

    const toast = new bootstrap.Toast(toastEl[0], opts);
    toast.show();
  }

  // ............
  initMoment()
  {
    moment.locale('de', moment.localeData["de"])
  }

  // .............
  initModals()
  {
    $('#houseModal').on('hidden.bs.modal', () =>
    {
      vHouseEditor.reset();
    });
  }
}
const ui = new UI();