//const bootstrap = require("bootstrap")
//const { default: Swal } = require("sweetalert2")

// const { default: Swal } = require("sweetalert2")
table1.onclick = function(e) {
      if(e.target.tagName != 'TH') return
      let th = e.target
      sortTable(th.cellIndex, th.dataset.type, 'table1')
}
table2.onclick = function(e) {
      if(e.target.tagName != 'TH') return
      let th = e.target
      sortTable(th.cellIndex, th.dataset.type, 'table2')
}
function sortTable(colNum, type, id) {
      let elem = document.getElementById(id)
      let tbody = elem.querySelector('tbody')
      let rowsArray = Array.from(tbody.rows)
      let compare
      switch (type) {
            case 'number':
                  compare = function(rowA,rowB) {
                        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
                  }
                  break;
      
            case 'string':
                  compare = function(rowA,rowB) {
                        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
                  }
                  break

      }
      rowsArray.sort(compare)
      tbody.append(...rowsArray)

}


if(!localStorage.getItem('goods')) {
      localStorage.setItem('goods', JSON.stringify([]))
}
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
      keyboard: false
})
let options = {
      valueNames: ['name','price']
}
let userList;

document.querySelector('button.add_new').addEventListener('click', function (e) {
      let name = document.getElementById('good_name').value
      let price = document.getElementById('good_price').value
      let count = document.getElementById('good_count').value
      if(name && price && count) {
            document.getElementById('good_name').value = ''
            document.getElementById('good_price').value = ''
            document.getElementById('good_count').value = '1'
            let goods = JSON.parse(localStorage.getItem('goods'))
            goods.push(['good_' + (goods.length+1), name, price, count, 0, 0, 0])
            localStorage.setItem('goods', JSON.stringify(goods))
            update_goods()
            myModal.hide()
      } else {
            Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Please fill in all fields',
            })
      }
})

function update_goods() {
      let result_price = 0
      let tbody = document.querySelector('.list')
      tbody.innerHTML = ""
      document.querySelector('.cart').innerHTML = ""
      let goods = JSON.parse(localStorage.getItem('goods'))
      if(goods.length) {
            table1.hidden = false
            table2.hidden = false
            for(let i = 0; i < goods.length;i++) {
                  tbody.insertAdjacentHTML('beforeend',
                  // [i][3] is quantity
                  `
                  <tr class = "align-middle">
                        <td>${i+1}</td>
                        <td class="name">${goods[i][1]}</td>
                        <td class="price">${goods[i][2]}</td>
                        <td>${goods[i][3]}</td> 
                        <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                        <td><button class="good_delete btn-primary" data-goods="${goods[i][0]}">&#10149;</button></td>
                  </tr>

                  `)
                  if(goods[i][4] > 0) { // quantity of items in the cart
                       //  goods[i][6]  - total sum
                        goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
                        result_price += goods [i][6]
                        document.querySelector('.cart').insertAdjacentHTML('beforeend', 
                        `
                        <tr class = "align-middle">
                              <td>${i+1}</td>
                              <td class="price_name">${goods[i][1]}</td>
                              <td class="price_one">${goods[i][2]}</td>
                              <td class="price_count">${goods[i][4]}</td>
                              <td class="price_discount"><input data-goodid="${goods[i][0]}" max="100" min="0" type=text value=${goods[i][5]}></td>
                              <td>${goods[i][6]}</td>
                              <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                              
                              
                              
                        </tr>
                        `)
                  }
            }
            userList = new List('goods', options);
      } else {
            table1.hidden = true
            table2.hidden = true
      }
      document.querySelector('.price_result').innerHTML = result_price + '$'

}

update_goods()

document.querySelector('.list').addEventListener('click', function(e){
      if(!e.target.dataset.delete) {
            return
      }
      Swal.fire({
            title: 'Attention!',
            text: 'Are you sure you want to delete this item?',
            icon: 'warning',
            showCancelButton:true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
      }).then((result) => {
            if(result.isConfirmed) {
                  let goods = JSON.parse(localStorage.getItem('goods'))
                  for(let i=0; i<goods.length; i++) {
                        if(goods[i][0] == e.target.dataset.delete) {
                              goods.splice(i, 1)
                              localStorage.setItem('goods', JSON.stringify(goods))
                              update_goods()
                        }
                  }
                  Swal.fire(
                        "Deleted",
                        "The selected product has been successfully deleted",
                        "Success"
                  )
            }
      })
})

document.querySelector('.list').addEventListener('click', function(e){
      if(!e.target.dataset.goods) {
            return
      }
      let goods = JSON.parse(localStorage.getItem('goods'))
      for(let i=0; i<goods.length; i++) {
            if(goods[i][3]>0 && goods[i][0] == e.target.dataset.goods) {
                  goods[i].splice(3,1, goods[i][3]-1)
                  goods[i].splice(4,1, goods[i][4]+1)
                  localStorage.setItem('goods', JSON.stringify(goods))
                  update_goods()
            }
      }

})

document.querySelector('.cart').addEventListener('click', function(e){
      if(!e.target.dataset.delete) {
            return
      }
      let goods = JSON.parse(localStorage.getItem('goods'))
      for(let i=0; i<goods.length; i++) {
            if(goods[i][4]>0 && goods[i][0] == e.target.dataset.delete) {
                  goods[i].splice(3,1, goods[i][3]+1)
                  goods[i].splice(4,1, goods[i][4]-1)
                  localStorage.setItem('goods', JSON.stringify(goods))
                  update_goods()
            }
      }

})
document.querySelector('.cart').addEventListener('input', function(e){
      if(!e.target.dataset.goodid) {
            console.log(false)

      }
      let goods = JSON.parse(localStorage.getItem('goods'))
      console.log(goods.length)
      for(let i=0; i<goods.length; i++) {
            if(goods[i][0] == e.target.dataset.goodid) {
                  goods[i][5] = e.target.value
                  goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
                  localStorage.setItem('goods', JSON.stringify(goods))
                  update_goods()
                  let input = document.querySelector(`[data-goodid="${goods[i][0]}"]`)
                  input.focus()
                  input.selectionStart = input.value.length
            }
      }
})