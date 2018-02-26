export class Model {
  constructor(url){
    this.data_rows = JSON.parse(http_get(url));

    this.selected_index = 1;
    this.range = 10;
    this.start_index = 1;
    this.end_index = 10;

    this.number_pages = Math.ceil(this.data_rows.length/this.range);

    this.rows_display = this.data_rows.slice(0, 10);
    this.rows_filtered = this.data_rows;

    this.previous_column = "";
    this.ordering = 1;

    this.search = "";
    this.all_search = [];

    this.checked_rows = [];
    this.check_all = false;


    this.edited_cell = "";
    this.edited_row = [];

    this.new_row = [];

    this.modal_add_active = false;
    this.modal_edit_active = false;
  }

  change_range(){
    this.selected_index = 1;
    this.update();
  }

  update(){
    this.start_index = this.range * (this.selected_index - 1) + 1;
    this.end_index = this.range * this.selected_index;
    if(this.end_index > this.rows_filtered.length)
      this.end_index = this.rows_filtered.length;

    this.rows_display = this.rows_filtered.slice(this.start_index - 1, this.end_index);
    this.number_pages = Math.ceil(this.rows_filtered.length/this.range);
  }

  next_page(){
    if(this.selected_index < this.number_pages)
      this.selected_index++;
    this.update();
  }

  previous_page(){
    if(this.selected_index > 1)
      this.selected_index--;
    this.update();
  }

  select_page(n){
    this.selected_index = n;
    this.update();
  }

  first_page(){
    this.selected_index = 1;
    this.update()
  }

  last_page(){
    this.selected_index = this.number_pages;
    this.update();
  }

  sort(column){
    if(this.previous_column === column)
      this.ordering *= -1;
    else
      this.ordering = 1;

    let _this = this;
    this.rows_filtered.sort(
      function(a, b){
        if(_this.ordering === 1){
          if(a[column] > b[column]) return 1;
          else if(a[column] < b[column]) return -1;
          return 0;
        }
        else{
          if(a[column] > b[column]) return -1;
          else if(a[column] < b[column]) return 1;
          return 0;
        }

      }
    );

    this.rows_display = this.rows_filtered.slice(this.start_index - 1, this.end_index);
    this.previous_column = column;
  }

  filter(){
    let _this = this;
    this.rows_filtered = this.data_rows.filter(
      function(value){
        var find = false;
        Object.values(value).forEach(function(element){
          if(String(element).indexOf(_this.search) !== -1){
            find = true;
          }
        });
        return find;
      }
    );

    this.rows_filtered = this.rows_filtered.filter(
      function(value){
        var find = true;
        for(var i = 0; i < _this.all_search.length; i++){
          var item = _this.all_search[i];
          var element = value[Object.keys(_this.data_rows[0])[i]];
          if(element !== undefined){
            if(item !== undefined){
              if(find === true){
                if(String(element).indexOf(item) === -1){
                  find = false;
                }
              }
            }
          }
        }

        return find;
      }
    );
    this.update();
  }

  delete_row(id){
    this.data_rows.splice(id, 1);
    this.checked_rows.splice(this.checked_rows.indexOf(id), 1);
    this.filter();
  }

  delete_rows(){
    this.checked_rows_copy = this.checked_rows.slice();
    for(var i = 0; i < this.checked_rows_copy.length; i++){
      var item = this.checked_rows_copy[i];
      this.delete_row(item);
    }
    if(this.selected_index === this.number_pages)
      this.previous_page();

    this.check_all = false;
  }

  select_all(){
    if(this.check_all === true){
      for(var i = 0; i < this.rows_display.length; i++){
        var item_id = this.data_rows.indexOf(this.rows_display[i]);
        if(!this.checked_rows.includes(item_id))
          this.checked_rows.push(item_id);
      }
    }
    else{
      this.checked_rows = [];
    }
  }

  edit_cell(id, column){
    this.edited_cell = String(id) + String(column);
  }

  add_row(){
    this.data_rows.push(this.new_row);
    this.modal_add_active = false;
  }

  edit_row(id){
    this.edited_row = this.data_rows[id];
    this.modal_edit_active = true;
    this.filter();
  }

}

function http_get(u){
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", u, false);
  xhttp.send(null);
  return xhttp.responseText;
}
